<?php
$headers = getallheaders();

error_reporting(E_ERROR | E_PARSE);
$method = $_SERVER['REQUEST_METHOD'];
$port = 3006;
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
    
    $allFormData = count($_FILES);
    if ($allFormData > 0){
    define('MULTIPART_BOUNDARY', '--------------------------'.microtime(true));
    $header = 'Content-Type: multipart/form-data; boundary='.MULTIPART_BOUNDARY.
            "\r\nAuthorization: $Auth\r\n";
    foreach ($_FILES as $key => $value) {

        $post_data = file_get_contents($_FILES[$key]['tmp_name']);
        define('FORM_FIELD', 'image'); 
        $content .=  "--".MULTIPART_BOUNDARY."\r\n".
        "Content-Disposition: form-data; name=\"".FORM_FIELD."\"; filename=\"".basename($_FILES[$key]['name'])."\"\r\n".
                    "Content-Type: application/zip\r\n\r\n".
                    $post_data."\r\n";
    }
    
    // add some POST fields to the request too: $_POST['foo'] = 'bar'
    foreach ($_POST as $key => $value) {
        $content .= "--".MULTIPART_BOUNDARY."\r\n".
                    "Content-Disposition: form-data; name=\"$key\"\r\n\r\n".
                    "$value\r\n";
    }
    // signal end of request (note the trailing "--")
    $content .= "--".MULTIPART_BOUNDARY."--\r\n";
    $options = array(
        'http' => array(
            'method' => $method,
            'content' => $content,
            'ignore_errors' => true,
            'header' => $header,
        )
        );
    
    }
    elseif ($method == 'POST' || $method == 'PUT' || $method == 'DELETE') {
        $post_data = file_get_contents('php://input');
        $options = array(
            'http' => array(
                'method' => $method,
                'content' => $post_data,
                'ignore_errors' => true,
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
                'ignore_errors' => true,
                'header' => "Content-type: application/json\r\n" .
                "Authorization: $Auth\r\n",
            )
        );
    } 
    else {
        $options = array(
            'http' => array(
                'method' => $method,
                'ignore_errors' => true,
                'header' => "Content-type: application/json\r\n" .
                "Authorization: $Auth\r\n",
            )
        );
    }
    $json_data = file_get_contents($rest_api_url, false, stream_context_create($options));

    foreach ($http_response_header as $value) {
        header($value);
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
