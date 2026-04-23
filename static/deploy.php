<?php

// GitHub Webhook secret token (set in your GitHub repository settings)
/*$githubSecret = 'ND264HhMq0mJQ0ga';

// Get the payload from the webhook request
$payload = file_get_contents('php://input');

// Get the signature from the headers
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'];

// Calculate the expected signature using HMAC and compare
$hash = 'sha256=' . hash_hmac('sha256', $payload, $githubSecret);

// Compare the received signature with the expected one
if (!hash_equals($signature, $hash)) {
  // Signature does not match, abort the process
  die('Invalid signature');
}*/

// Set up the paths and commands
$appDir = '/var/www/pmis-frontend';
$logFile = $appDir . '/deploy.log';
$sshCommand = "$appDir/deploy.sh";

// Run the deployment script in the background
$command = "nohup $sshCommand > $logFile 2>&1 &";
exec($command, $output, $return);

// Print the output (optional for debugging)
echo "<pre>";
echo "Output: \n";
print_r($output);
echo "Return: \n";
print_r($return);
echo "</pre>";
