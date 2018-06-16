<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
class Scancode extends CI_Controller {
    

    public function index($d,$d2) {
        DB::insert('Friend', [
          'ID1' => $d,
          'ID2' => $d2
        ]);
        DB::insert('Friend', [
          'ID1' => $d2,
          'ID2' => $d
        ]);
}
}
