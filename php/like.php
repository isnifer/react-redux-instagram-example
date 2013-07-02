<?php

  $token = $_GET['access_token'];
  $id = $_GET['photoId'];
  $data = array('access_token' => $token);
  $url = 'https://api.instagram.com/v1/media/'. $id .'/likes';

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