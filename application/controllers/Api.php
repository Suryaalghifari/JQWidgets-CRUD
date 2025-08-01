<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Api extends CI_Controller {
    public function products() {
        // Path ke file JSON (pastikan path benar, relatif terhadap root project)
        $json_path = FCPATH . 'data/products.json';
        // Cek apakah file ada
        if (file_exists($json_path)) {
            $json_data = file_get_contents($json_path);
            header('Content-Type: application/json');
            echo $json_data;
        } else {
            show_404();
        }
    }
}
