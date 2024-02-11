<?php

error_reporting(E_ERROR | E_PARSE);



$endpoint = $_GET['endpoint'];
$method = $_GET['method'];
if (isset($endpoint) && isset($method)) {
    $rest_api_url = 'http://localhost:3001/' . $endpoint;

    // post data
    if ($method == 'POST') {
        $post_data = file_get_contents('php://input');
        $options = array(
            'http' => array(
                'method' => $method,
                'header' => "Content-type: application/json\r\n",
                'content' => $post_data
            )
        );
    } else {
        $options = array(
            'http' => array(
                'method' => $method,
                'header' => "Content-type: application/json\r\n"
            )
        );
    }


    $json_data = file_get_contents($rest_api_url, false, stream_context_create($options));

    if ($json_data === FALSE) {
        echo "API call failed";
        http_response_code(404);
        exit();
    }

    header('Content-Type: application/json; charset=utf-8');

    // Reads the JSON file.
    echo $json_data;

} else {
    echo "No endpoint provided";
}


?>
