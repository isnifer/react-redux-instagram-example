<?php

  $token = $_GET['access_token'];
  $id = $_GET['photoId'];
  $action = $_GET['action'];
  $data = array('access_token' => $token);

  if ($action === 'POST'){
    $url = 'https://api.instagram.com/v1/media/'. $id .'/likes';
    $options = array(
      'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data),
      ),
    );
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    print_r($result);
  } else {
    $result = file_get_contents(
      'https://api.instagram.com/v1/media/'. $id .'/likes?access_token=' . $token,
      false,
      stream_context_create(
        array(
          'http' => array(
            'method' => 'DELETE'
          )
        )
      )
    );
    print_r($result);
  }

?>