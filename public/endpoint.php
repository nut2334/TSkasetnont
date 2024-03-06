<?php
$headers = getallheaders();

// error_reporting(E_ERROR | E_PARSE);
$method = $_SERVER['REQUEST_METHOD'];
$port = 3001;
$url = 'http://localhost:' . $port . '/';
$Auth = null;
//find the Authorization header
foreach ($headers as $header => $value) {
    if ($header == 'Authorization') {
        $Auth = $value;
    }
}

$endpoint = $_GET['endpoint'];
if (isset($endpoint) && isset($method)) {
    $rest_api_url = $url . $endpoint;
    // $rest_api_url = 'http://localhost:3001/' . mb_convert_encoding($endpoint, 'UTF-8', "ISO-8859-1");
    // post data
    $content_type = "application/json";
    $str_arr = explode("/",$endpoint); 
    if ($str_arr[0] == 'getproduct') {
        $rest_api_url = $url . $str_arr[0] . '/' . urlencode($str_arr[1]) . '/' . $str_arr[2];
    }

    if ($method == 'POST') {
        $post_data = file_get_contents('php://input');
        $options = array(
            'http' => array(
                'method' => $method,
                'content' => $post_data,
                'header' => "Content-type: $content_type\r\n" .
                    "Authorization: $Auth\r\n",
            )
        );
    } elseif ($method == 'GET'){
        function getAllParams() {
            $allParam = array();
            foreach($_GET as $key => $value) {
                if ($key == 'endpoint') {
                    continue;
                }
                $allParam[$key] = $value;
            }
            return $allParam;
        }
        $allParam = getAllParams();

        if (count($allParam) > 0) {
            $rest_api_url = $rest_api_url . '?' . http_build_query($allParam);
        } else {
            $rest_api_url = $rest_api_url;
        }

        $options = array(
            'http' => array(
                'method' => $method,
                'header' => "Content-type: application/json\r\n" .
                "Authorization: $Auth\r\n",
            )
        );
    } 
    else {
        $options = array(
            'http' => array(
                'method' => $method,
                'header' => "Content-type: application/json\r\n" .
                "Authorization: $Auth\r\n",
            )
        );
    }
    $json_data = file_get_contents($rest_api_url, false, stream_context_create($options));
    if ($json_data === FALSE) {

        http_response_code(500);
        return json_encode(array('error' => 'API call failed'));
    }
    header('Content-Type: application/json; charset=utf-8');
    // Reads the JSON file.
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: *');
    echo $json_data;
} else {
    http_response_code(404);
    return json_encode(array('error' => 'API call failed'));
}
?>
