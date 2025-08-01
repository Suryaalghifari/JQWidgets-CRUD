<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Grid extends CI_Controller {
    public function index() {
        // Baca data JSON
        $json_path = FCPATH . 'data/products.json';
        $products = [];
        if (file_exists($json_path)) {
            $products = json_decode(file_get_contents($json_path), true);
        }
        // Kirim data ke view
        $data['products'] = $products;
        $this->load->view('home/grid_view', $data);
    }
}
