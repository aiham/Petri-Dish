<?php

sleep(1);

ob_start();

$lib_dir = '/path/to/petridish/';

$reports_path = $lib_dir . 'reports/';
$errors_path  = $lib_dir . 'errors/';

function get_unique_filename ($path) {
  $i = 1;
  
  $date = date('Y-m-d_H-i-s');
  
  do {
    $filename = $path . $date;
    if ($i > 1) {
      $filename .= '_' . $i;
    }
    $filename .= '.txt';
    $i++;
  } while (file_exists($filename));

  return $filename;
}

function error_handler ($errno, $errstr, $errfile, $errline) {
  global $errors_path;

  if (!(error_reporting() & $errno)) {
    // This error code is not included in error_reporting
    return;
  }

  $error_details = '';
  switch ($errno) {
    case E_USER_ERROR:
      $error_details = "Error [$errno]: $errstr on line $errline in file $errfile\n";
      break;

    case E_USER_WARNING:
      $error_details = "Warning [$errno]: $errstr\n";
      break;

    case E_USER_NOTICE:
      $error_details = "Notice [$errno]: $errstr\n";
      break;

    default:
      $error_details = "Unknown error type: [$errno] $errstr\n";
      break;
  }

  $filename = get_unique_filename($errors_path);
  @file_put_contents($filename, $error_details);

  /* Don't execute PHP internal error handler */
  return true;
}

@set_error_handler('error_handler');

$details = isset($_POST['details']) ? trim(strval($_POST['details'])) : '';

if (strlen($details) <= 0) {
  ob_end_clean();
  exit;
}

$filename = get_unique_filename($reports_path);
file_put_contents($filename, $details);

ob_end_clean();

if (isset($_POST['show_thanks']) && $_POST['show_thanks'] === 'yes') {
  $host  = $_SERVER['HTTP_HOST'];
  $uri   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
  $extra = 'thanks.html';
  header("Location: http://$host$uri/$extra");
  exit;
}
