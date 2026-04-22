$ErrorActionPreference = "Stop"
$base = "http://localhost:8080/api"
$ts = Get-Date -Format "yyyyMMddHHmmss"
$password = "Pass@123"

function Get-HttpStatus {
  param(
    [string]$Method,
    [string]$Url,
    [hashtable]$Headers,
    [string]$Body
  )

  try {
    if ($Body) {
      $resp = Invoke-WebRequest -Method $Method -Uri $Url -Headers $Headers -ContentType "application/json" -Body $Body -UseBasicParsing
    } else {
      $resp = Invoke-WebRequest -Method $Method -Uri $Url -Headers $Headers -UseBasicParsing
    }
    return [int]$resp.StatusCode
  } catch {
    if ($_.Exception.Response) {
      return [int]$_.Exception.Response.StatusCode
    }
    return -1
  }
}

function Register-User {
  param([string]$Name, [string]$Email, [string]$Role)
  $body = @{ fullName = $Name; email = $Email; password = $password; role = $Role } | ConvertTo-Json -Compress
  return Invoke-RestMethod -Method Post -Uri "$base/auth/register" -ContentType "application/json" -Body $body
}

function Login-User {
  param([string]$Email)
  $body = @{ email = $Email; password = $password } | ConvertTo-Json -Compress
  return Invoke-RestMethod -Method Post -Uri "$base/auth/login" -ContentType "application/json" -Body $body
}

$adminEmail = "admin.$ts@test.local"
$facultyEmail = "faculty.$ts@test.local"
$studentEmail = "student.$ts@test.local"

$adminReg = Register-User -Name "Admin $ts" -Email $adminEmail -Role "ADMIN"
$facultyReg = Register-User -Name "Faculty $ts" -Email $facultyEmail -Role "FACULTY"
$studentReg = Register-User -Name "Student $ts" -Email $studentEmail -Role "STUDENT"

$adminLogin = Login-User -Email $adminEmail
$facultyLogin = Login-User -Email $facultyEmail
$studentLogin = Login-User -Email $studentEmail

$adminToken = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${adminEmail}:$password"))
$facultyToken = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${facultyEmail}:$password"))
$studentToken = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${studentEmail}:$password"))

$adminH = @{ Authorization = "Basic $adminToken" }
$facultyH = @{ Authorization = "Basic $facultyToken" }
$studentH = @{ Authorization = "Basic $studentToken" }

$start = (Get-Date).AddMinutes(10).ToString("s")
$end = (Get-Date).AddMinutes(70).ToString("s")
$examBody = @{ title = "RBAC Exam $ts"; description = "Role flow exam"; startTime = $start; endTime = $end; durationMinutes = 60; totalMarks = 100 } | ConvertTo-Json -Compress

$adminCreateExamStatus = Get-HttpStatus -Method "POST" -Url "$base/exams" -Headers $adminH -Body $examBody
$facultyExam = Invoke-RestMethod -Method Post -Uri "$base/exams" -Headers $facultyH -ContentType "application/json" -Body $examBody
$facultyCreateExamStatus = 200
$studentCreateExamStatus = Get-HttpStatus -Method "POST" -Url "$base/exams" -Headers $studentH -Body $examBody

$questionBody = @{ questionText = "2 + 2 = ?"; questionType = "MCQ"; optionsData = "1|2|3|4"; answerKey = "4"; marks = 1 } | ConvertTo-Json -Compress
$adminAddQStatus = Get-HttpStatus -Method "POST" -Url "$base/questions/exam/$($facultyExam.id)" -Headers $adminH -Body $questionBody
$facultyAddQStatus = Get-HttpStatus -Method "POST" -Url "$base/questions/exam/$($facultyExam.id)" -Headers $facultyH -Body $questionBody
$studentAddQStatus = Get-HttpStatus -Method "POST" -Url "$base/questions/exam/$($facultyExam.id)" -Headers $studentH -Body $questionBody

$evalBody = @{ answerId = 999999; awardedMarks = 1 } | ConvertTo-Json -Compress
$adminEvalStatus = Get-HttpStatus -Method "POST" -Url "$base/answers/evaluate" -Headers $adminH -Body $evalBody
$facultyEvalStatus = Get-HttpStatus -Method "POST" -Url "$base/answers/evaluate" -Headers $facultyH -Body $evalBody
$studentEvalStatus = Get-HttpStatus -Method "POST" -Url "$base/answers/evaluate" -Headers $studentH -Body $evalBody

$adminPublishStatus = Get-HttpStatus -Method "POST" -Url "$base/results/publish?examId=$($facultyExam.id)&studentId=$($studentReg.id)" -Headers $adminH -Body $null
$facultyPublishStatus = Get-HttpStatus -Method "POST" -Url "$base/results/publish?examId=$($facultyExam.id)&studentId=$($studentReg.id)" -Headers $facultyH -Body $null
$studentPublishStatus = Get-HttpStatus -Method "POST" -Url "$base/results/publish?examId=$($facultyExam.id)&studentId=$($studentReg.id)" -Headers $studentH -Body $null

$adminUsersStatus = Get-HttpStatus -Method "GET" -Url "$base/users" -Headers $adminH -Body $null
$facultyUsersStatus = Get-HttpStatus -Method "GET" -Url "$base/users" -Headers $facultyH -Body $null
$studentUsersStatus = Get-HttpStatus -Method "GET" -Url "$base/users" -Headers $studentH -Body $null

$studentViewExamsStatus = Get-HttpStatus -Method "GET" -Url "$base/exams" -Headers $studentH -Body $null
$studentAttemptExamStatus = Get-HttpStatus -Method "GET" -Url "$base/exams/live" -Headers $studentH -Body $null
$studentResultStatus = Get-HttpStatus -Method "GET" -Url "$base/results/me" -Headers $studentH -Body $null

Write-Host "=== Login Responses ==="
Write-Host "ADMIN login role: $($adminLogin.role)"
Write-Host "FACULTY login role: $($facultyLogin.role)"
Write-Host "STUDENT login role: $($studentLogin.role)"
Write-Host ""
Write-Host "=== Role Verification Status Codes ==="
Write-Host "ADMIN   -> Manage Users(GET /users): $adminUsersStatus | Create Exam(POST /exams): $adminCreateExamStatus | Publish Results(POST /results/publish): $adminPublishStatus"
Write-Host "FACULTY -> Create Exam(POST /exams): $facultyCreateExamStatus | Add Questions(POST /questions/exam/{id}): $facultyAddQStatus | Evaluate Answers(POST /answers/evaluate): $facultyEvalStatus"
Write-Host "STUDENT -> View Exams(GET /exams): $studentViewExamsStatus | Attempt Exam(GET /exams/live): $studentAttemptExamStatus | View Result(GET /results/me): $studentResultStatus"
Write-Host ""
Write-Host "=== Forbidden Checks ==="
Write-Host "ADMIN   forbidden Add Questions: $adminAddQStatus | forbidden Evaluate Answers: $adminEvalStatus"
Write-Host "FACULTY forbidden Manage Users: $facultyUsersStatus | forbidden Publish Results: $facultyPublishStatus"
Write-Host "STUDENT forbidden Create Exam: $studentCreateExamStatus | forbidden Add Questions: $studentAddQStatus | forbidden Evaluate Answers: $studentEvalStatus | forbidden Publish Results: $studentPublishStatus | forbidden Manage Users: $studentUsersStatus"
