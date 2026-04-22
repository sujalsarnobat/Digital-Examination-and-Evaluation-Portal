$ErrorActionPreference = "Stop"
$base = "http://localhost:8080/api"
$ts = Get-Date -Format "yyyyMMddHHmmss"
$password = "Pass@123"

function To-JsonBody {
  param([object]$Obj)
  return $Obj | ConvertTo-Json -Compress -Depth 10
}

function Invoke-Step {
  param(
    [string]$Name,
    [scriptblock]$Action
  )

  try {
    $res = & $Action
    Write-Host "PASS: $Name"
    return @{ ok = $true; data = $res }
  } catch {
    $msg = if ($_.ErrorDetails.Message) {
      $_.ErrorDetails.Message
    } elseif ($_.Exception.Message) {
      $_.Exception.Message
    } else {
      $_.ToString()
    }
    Write-Host "FAIL: $Name => $msg"
    return @{ ok = $false; error = $msg }
  }
}

function Register-User {
  param(
    [string]$Name,
    [string]$Email,
    [string]$Role
  )

  return Invoke-RestMethod -Method Post -Uri "$base/auth/register" -ContentType "application/json" -Body (To-JsonBody @{
    fullName = $Name
    email = $Email
    password = $password
    role = $Role
  })
}

function Get-BasicAuthHeader {
  param([string]$Email)
  $token = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${Email}:$password"))
  return @{ Authorization = "Basic $token" }
}

$adminEmail = "admin.$ts@test.local"
$facultyEmail = "faculty.$ts@test.local"
$studentEmail = "student.$ts@test.local"

$adminReg = Invoke-Step "Register ADMIN" { Register-User -Name "Admin $ts" -Email $adminEmail -Role "ADMIN" }
if (-not $adminReg.ok) { exit 1 }

$facultyReg = Invoke-Step "Register FACULTY" { Register-User -Name "Faculty $ts" -Email $facultyEmail -Role "FACULTY" }
if (-not $facultyReg.ok) { exit 1 }

$studentReg = Invoke-Step "Register STUDENT" { Register-User -Name "Student $ts" -Email $studentEmail -Role "STUDENT" }
if (-not $studentReg.ok) { exit 1 }

$adminH = Get-BasicAuthHeader -Email $adminEmail
$facultyH = Get-BasicAuthHeader -Email $facultyEmail
$studentH = Get-BasicAuthHeader -Email $studentEmail

$start = (Get-Date).AddMinutes(-5).ToString("s")
$end = (Get-Date).AddHours(2).ToString("s")

$examBody = @{
  title = "E2E $ts"
  description = "flow test"
  startTime = $start
  endTime = $end
  durationMinutes = 60
  totalMarks = 15
}

$examStep = Invoke-Step "Faculty creates exam" {
  Invoke-RestMethod -Method Post -Uri "$base/exams" -Headers $facultyH -ContentType "application/json" -Body (To-JsonBody $examBody)
}
if (-not $examStep.ok) { exit 1 }
$exam = $examStep.data

$mcqBody = @{
  questionText = "Capital of France?"
  questionType = "MCQ"
  optionsData = "Paris|Rome|Berlin|Madrid"
  answerKey = "Paris"
  marks = 5
}

$descBody = @{
  questionText = "Explain OOAD principles."
  questionType = "DESCRIPTIVE"
  marks = 10
}

$q1 = Invoke-Step "Faculty adds MCQ" {
  Invoke-RestMethod -Method Post -Uri "$base/questions/exam/$($exam.id)" -Headers $facultyH -ContentType "application/json" -Body (To-JsonBody $mcqBody)
}
if (-not $q1.ok) { exit 1 }

$q2 = Invoke-Step "Faculty adds DESCRIPTIVE" {
  Invoke-RestMethod -Method Post -Uri "$base/questions/exam/$($exam.id)" -Headers $facultyH -ContentType "application/json" -Body (To-JsonBody $descBody)
}
if (-not $q2.ok) { exit 1 }

$live = Invoke-Step "Faculty publishes exam LIVE" {
  Invoke-RestMethod -Method Patch -Uri "$base/exams/$($exam.id)/status?status=LIVE" -Headers $facultyH
}
if (-not $live.ok) { exit 1 }

$availableBefore = Invoke-Step "Student sees exam in live available list" {
  Invoke-RestMethod -Method Get -Uri "$base/exams/live/available" -Headers $studentH
}
if (-not $availableBefore.ok) { exit 1 }

$examVisible = $availableBefore.data | Where-Object { $_.id -eq $exam.id } | Select-Object -First 1
if (-not $examVisible) {
  Write-Host "FAIL: Student cannot see LIVE exam in /exams/live/available"
  exit 1
}
Write-Host "PASS: Student can see LIVE exam"

$questionsStep = Invoke-Step "Student fetches exam questions" {
  Invoke-RestMethod -Method Get -Uri "$base/questions/exam/$($exam.id)" -Headers $studentH
}
if (-not $questionsStep.ok) { exit 1 }

$mcqQuestion = $questionsStep.data | Where-Object { $_.questionType -eq "MCQ" } | Select-Object -First 1
$descQuestion = $questionsStep.data | Where-Object { $_.questionType -eq "DESCRIPTIVE" } | Select-Object -First 1

if (-not $mcqQuestion -or -not $descQuestion) {
  Write-Host "FAIL: Did not get both MCQ and DESCRIPTIVE questions"
  exit 1
}

$mcqSubmit = Invoke-Step "Student submits MCQ answer" {
  Invoke-RestMethod -Method Post -Uri "$base/answers/submit" -Headers $studentH -ContentType "application/json" -Body (To-JsonBody @{
    examId = $exam.id
    questionId = $mcqQuestion.id
    selectedOption = "Paris"
  })
}
if (-not $mcqSubmit.ok) { exit 1 }

if ($mcqSubmit.data.evaluationStatus -ne "AUTO_EVALUATED" -or [int]$mcqSubmit.data.awardedMarks -ne 5) {
  Write-Host "FAIL: MCQ auto-evaluation incorrect status=$($mcqSubmit.data.evaluationStatus) marks=$($mcqSubmit.data.awardedMarks)"
  exit 1
}
Write-Host "PASS: MCQ auto-evaluated correctly"

$descSubmit = Invoke-Step "Student submits descriptive answer" {
  Invoke-RestMethod -Method Post -Uri "$base/answers/submit" -Headers $studentH -ContentType "application/json" -Body (To-JsonBody @{
    examId = $exam.id
    questionId = $descQuestion.id
    responseText = "Solid explanation text"
  })
}
if (-not $descSubmit.ok) { exit 1 }

if ($descSubmit.data.evaluationStatus -ne "MANUAL_REVIEW_PENDING") {
  Write-Host "FAIL: Descriptive answer not marked MANUAL_REVIEW_PENDING"
  exit 1
}
Write-Host "PASS: Descriptive answer pending manual review"

$facultyAnswers = Invoke-Step "Faculty loads descriptive answers" {
  Invoke-RestMethod -Method Get -Uri "$base/answers/exam/$($exam.id)/question/$($descQuestion.id)" -Headers $facultyH
}
if (-not $facultyAnswers.ok) { exit 1 }

$answerToEvaluate = $facultyAnswers.data | Where-Object { $_.id -eq $descSubmit.data.id } | Select-Object -First 1
if (-not $answerToEvaluate) {
  Write-Host "FAIL: Faculty cannot find submitted descriptive answer"
  exit 1
}

$evalStep = Invoke-Step "Faculty evaluates descriptive answer" {
  Invoke-RestMethod -Method Post -Uri "$base/answers/evaluate" -Headers $facultyH -ContentType "application/json" -Body (To-JsonBody @{
    answerId = $descSubmit.data.id
    awardedMarks = 8
  })
}
if (-not $evalStep.ok) { exit 1 }

$studentResults = Invoke-Step "Student loads published results" {
  Invoke-RestMethod -Method Get -Uri "$base/results/me" -Headers $studentH
}
if (-not $studentResults.ok) { exit 1 }

$myResult = $studentResults.data | Where-Object { $_.exam.id -eq $exam.id } | Select-Object -First 1
if (-not $myResult) {
  Write-Host "FAIL: Result not visible to student after faculty evaluation"
  exit 1
}
Write-Host "PASS: Result visible totalScore=$($myResult.totalScore) percentage=$($myResult.percentage) grade=$($myResult.grade)"

$availableAfter = Invoke-Step "Student list excludes completed exam" {
  Invoke-RestMethod -Method Get -Uri "$base/exams/live/available" -Headers $studentH
}
if (-not $availableAfter.ok) { exit 1 }

$stillVisible = $availableAfter.data | Where-Object { $_.id -eq $exam.id } | Select-Object -First 1
if ($stillVisible) {
  Write-Host "FAIL: Completed exam still appears in attempt list"
  exit 1
}
Write-Host "PASS: Completed exam hidden from attempt list"

Write-Host ""
Write-Host "E2E WORKFLOW PASSED"
exit 0
