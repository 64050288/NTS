<?php
/* contact.php — minimal & safe
 * HTML form fields: name, email, comments (ตามตัวอย่างของคุณ)
 * method="POST" action="php/contact.php"  (สมมติเก็บไฟล์ใน /php)
 ******************************************/

// 1) รับค่า POST
$name     = trim($_POST['name']     ?? '');
$email    = trim($_POST['email']    ?? '');
$comments = trim($_POST['comments'] ?? '');

// 2) ตรวจสอบข้อมูล
function json_error($msg){
    echo "<div class='error_message'>$msg</div>";
    exit;
}

if ($name === '')               json_error('กรุณากรอกชื่อ');
if ($email === '')              json_error('กรุณากรอกอีเมล');
if (!filter_var($email, FILTER_VALIDATE_EMAIL))
                                 json_error('อีเมลไม่ถูกต้อง');
if ($comments === '')           json_error('กรุณากรอกข้อความ');

// 3) ตั้งค่าผู้รับ / หัวข้อ
$to      = 'ntstest.deploy@gmail.com';          // ← เปลี่ยนเป็นอีเมลของคุณ
$subject = "ติดต่อจากเว็บไซต์โดย $name";

// 4) สร้างเนื้อหาอีเมล
$body  = "คุณได้รับข้อความจากแบบฟอร์มเว็บไซต์\n\n";
$body .= "ชื่อ:   $name\n";
$body .= "อีเมล: $email\n\n";
$body .= "ข้อความ:\n$comments\n";

$headers  = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// 5) ส่งอีเมล
if (mail($to, $subject, $body, $headers)) {
    echo "<div id='success_page'><h3>ส่งข้อความสำเร็จ</h3>
          <p>ขอบคุณ <strong>".htmlspecialchars($name)."</strong> เราได้รับข้อความแล้ว</p></div>";
} else {
    echo "<div class='error_message'>เกิดข้อผิดพลาด ไม่สามารถส่งอีเมลได้</div>";
}
