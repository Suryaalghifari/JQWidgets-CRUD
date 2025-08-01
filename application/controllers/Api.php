<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * @property CI_Input $input
 * @property Product_model $Product_model
 */

class Api extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Product_model'); 
    }

    public function products_get() // api untuk ambil semua data produk
    {
        $products = $this->Product_model->get_all(); 
        header('Content-Type: application/json');
        echo json_encode($products);
    }

    public function products_add()
    {
        $data = $this->input->post();

        // --- Daftar field yang wajib diisi ---
        $required = ['name', 'type', 'calories', 'totalfat', 'protein', 'quantity', 'unit_price'];

        // --- Loop validasi semua field wajib ---
        foreach ($required as $field) {
            if (empty($data[$field]) && $data[$field] !== "0") {
                echo json_encode([
                    'success' => false, 
                    'message' => ucfirst($field) . ' wajib diisi'
                ]);
                return;
            }
        }

        // --- Insert ke database ---
        $id = $this->Product_model->insert($data);
        if ($id) {
            echo json_encode(['success' => true, 'id' => $id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal insert data']);
        }
    }

}