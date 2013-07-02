<?php

  $token = $_GET['access_token'];
  $action = $_GET['action'];
  $userId = $_GET['userId'];
  $data = array('access_token' => $token, 'action' => $action);
  $url = 'https://api.instagram.com/v1/users/'. $userId .'/relationship?';

  // use key 'http' even if you send the request to https://...
  $options = array(
      'http' => array(
          'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
          'method'  => 'POST',
          'content' => http_build_query($data),
      ),
  );
  $context  = stream_context_create($options);
  $result = file_get_contents($url, false, $context);

  print_r($result);
?>