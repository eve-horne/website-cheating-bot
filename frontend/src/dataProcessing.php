<!DOCTYPE  html>
<html>
<body>

<?php
$cInput = $_POST["coursecode"];
$qInput = $_POST["questions"];
$aInput = $_POST["answers"];

$qArr = explode('@@', $qInput);
$aArr = explode('##', $aInput);

$numQ = count($qArr);
$numA = count($aArr);

echo "Course Code: ", $cInput, "<br><br>";

$idx = 1;
for ($x = 0; $x < $numQ - 1; $x++) {
   $value = $qArr[$x];
   echo "Question ", $idx, ": ", $value, "<br>";
   $idx++;
}
echo "<br>";
$idx = 1;
for ($x = 0; $x < $numA - 1; $x++) {
   $value = $aArr[$x];
   echo "Answer ", $idx, ": ", $value, "<br>";
   $idx++;
}
echo "<br>";
?>

</body>
</html>
