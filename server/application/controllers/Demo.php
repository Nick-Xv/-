<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Demo extends CI_Controller {
    public function index() {
        $this->json([
            'code' => 0,
            'data' => [
                'msg' => 'this is test environment, if you see this, means your upload failed'
            ]
        ]);
    }
}