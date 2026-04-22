$ErrorActionPreference = "Continue"
$base = "http://localhost:8080/api"
$ts = Get-Date -Format "yyyyMMddHHmmss"
$password = "Pass@123"

function Get-Status {
  param(
    [string]$Method,
    [string]$Url,
    [hashtable]$Headers,
    [string]$Body
  )

  try {
    if ($Body) {
      $r = Invoke-WebRequest -Method $Method -Uri $Url -Headers $Headers -ContentType "application/json" -Body $Body -UseBasicParsing -ErrorAction Stop
    } else {
      $r = Invoke-WebRequest -Method $Method -Uri $Url -Headers $Headers -UseBasicParsing -ErrorAction Stop
    }
    return [int]$r.StatusCode
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
  return Get-Status -Method "POST" -Url "$base/auth/register" -Headers @{} -Body $body
}

$adminEmail = "admin.$ts@test.local"
$facultyEmail = "faculty.$ts@test.local"
$studentEmail = "student.$ts@test.local"

$adminRegStatus = Register-User -Name "Admin $ts" -Email $adminEmail -Role "ADMIN"
$facultyRegStatus = Register-User -Name "Faculty $ts" -Email $facultyEmail -Role "FACULTY"
$studentRegStatus = Register-User -Name "Student $ts" -Email $studentEmail -Role "STUDENT"

$adminToken = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${adminEmail}:$password"))
$facultyToken = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${facultyEmail}:$password"))
$studentToken = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${studentEmail}:$password"))

$adminH = @{ Authorization = "Basic $adminToken" }
$facultyH = @{ Authorization = "Basic $facultyToken" }
$studentH = @{ Authorization = "Basic $studentToken" }

$examBody = @{ title = "RBAC Exam $ts"; description = "Role flow exam"; startTime = (Get-Date).AddMinutes(10).ToString("s"); endTime = (Get-Date).AddMinutes(70).ToString("s"); durationMinutes = 60; totalMarks = 100 } | ConvertTo-Json -Compress
$questionBody = @{ questionText = "2 + 2 = ?"; questionType = "MCQ"; optionsData = "1|2|3|4"; answerKey = "4"; marks = 1 } | ConvertTo-Json -Compress
$evalBody = @{ answerId = 999999; awardedMarks = 1 } | ConvertTo-Json -Compress

$checks = @(
  @{ Role = "ADMIN"; Feature = "Manage users"; Expected = "ALLOW"; Status = (Get-Status -Method "GET" -Url "$base/users" -Headers $adminH -Body $null) },
  @{ Role = "ADMIN"; Feature = "Create exam"; Expected = "ALLOW"; Status = (Get-Status -Method "POST" -Url "$base/exams" -Headers $adminH -Body $examBody) },
  @{ Role = "ADMIN"; Feature = "Publish results"; Expected = "ALLOW"; Status = (Get-Status -Method "POST" -Url "$base/results/publish?examId=999999&studentId=999999" -Headers $adminH -Body $null) },
  @{ Role = "ADMIN"; Feature = "Add questions"; Expected = "DENY"; Status = (Get-Status -Method "POST" -Url "$base/questions/exam/999999" -Headers $adminH -Body $questionBody) },
  @{ Role = "ADMIN"; Feature = "Evaluate answers"; Expected = "DENY"; Status = (Get-Status -Method "POST" -Url "$base/answers/evaluate" -Headers $adminH -Body $evalBody) },

  @{ Role = "FACULTY"; Feature = "Create exam"; Expected = "ALLOW"; Status = (Get-Status -Method "POST" -Url "$base/exams" -Headers $facultyH -Body $examBody) },
  @{ Role = "FACULTY"; Feature = "Add questions"; Expected = "ALLOW"; Status = (Get-Status -Method "POST" -Url "$base/questions/exam/999999" -Headers $facultyH -Body $questionBody) },
  @{ Role = "FACULTY"; Feature = "Evaluate answers"; Expected = "ALLOW"; Status = (Get-Status -Method "POST" -Url "$base/answers/evaluate" -Headers $facultyH -Body $evalBody) },
  @{ Role = "FACULTY"; Feature = "Manage users"; Expected = "DENY"; Status = (Get-Status -Method "GET" -Url "$base/users" -Headers $facultyH -Body $null) },
  @{ Role = "FACULTY"; Feature = "Publish results"; Expected = "DENY"; Status = (Get-Status -Method "POST" -Url "$base/results/publish?examId=999999&studentId=999999" -Headers $facultyH -Body $null) },

  @{ Role = "STUDENT"; Feature = "View exams"; Expected = "ALLOW"; Status = (Get-Status -Method "GET" -Url "$base/exams" -Headers $studentH -Body $null) },
  @{ Role = "STUDENT"; Feature = "Attempt exam"; Expected = "ALLOW"; Status = (Get-Status -Method "GET" -Url "$base/exams/live" -Headers $studentH -Body $null) },
  @{ Role = "STUDENT"; Feature = "View result"; Expected = "ALLOW"; Status = (Get-Status -Method "GET" -Url "$base/results/me" -Headers $studentH -Body $null) },
  @{ Role = "STUDENT"; Feature = "Create exam"; Expected = "DENY"; Status = (Get-Status -Method "POST" -Url "$base/exams" -Headers $studentH -Body $examBody) },
  @{ Role = "STUDENT"; Feature = "Add questions"; Expected = "DENY"; Status = (Get-Status -Method "POST" -Url "$base/questions/exam/999999" -Headers $studentH -Body $questionBody) },
  @{ Role = "STUDENT"; Feature = "Evaluate answers"; Expected = "DENY"; Status = (Get-Status -Method "POST" -Url "$base/answers/evaluate" -Headers $studentH -Body $evalBody) },
  @{ Role = "STUDENT"; Feature = "Publish results"; Expected = "DENY"; Status = (Get-Status -Method "POST" -Url "$base/results/publish?examId=999999&studentId=999999" -Headers $studentH -Body $null) },
  @{ Role = "STUDENT"; Feature = "Manage users"; Expected = "DENY"; Status = (Get-Status -Method "GET" -Url "$base/users" -Headers $studentH -Body $null) }
)

$checks | ForEach-Object {
  $status = [int]$_.Status
  $pass = $false
  if ($_.Expected -eq "ALLOW") {
    $pass = ($status -ne 401 -and $status -ne 403 -and $status -ne -1)
  } else {
    $pass = ($status -eq 403)
  }

  [PSCustomObject]@{
    Role = $_.Role
    Feature = $_.Feature
    Expected = $_.Expected
    Status = $status
    Pass = $pass
  }
} | Format-Table -AutoSize

Write-Host ""
Write-Host "Register status codes: ADMIN=$adminRegStatus FACULTY=$facultyRegStatus STUDENT=$studentRegStatus"
