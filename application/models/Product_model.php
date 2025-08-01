<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Product_model extends CI_Model
{
    public function get_all() // model ambil semua data produk
    {
        return $this->db->get('products')->result_array();
    }
    public function insert($data) {
    // Jangan ikutkan id
    unset($data['id']);

    // Pastikan INT dikonversi ke integer
    $data['quantity']    = isset($data['quantity']) && is_numeric($data['quantity']) ? intval($data['quantity']) : 0;
    $data['unit_price']  = isset($data['unit_price']) && is_numeric($data['unit_price']) ? intval($data['unit_price']) : 0;
    $data['total_price'] = isset($data['total_price']) && is_numeric($data['total_price']) ? intval($data['total_price']) : 0;
        
    // Filter hanya field yang ada di tabel
    $allowed = ['name', 'type', 'calories', 'totalfat', 'protein', 'quantity', 'unit_price', 'total_price'];
    $insertData = array_intersect_key($data, array_flip($allowed));

    $this->db->insert('products', $insertData);
    return $this->db->insert_id();
    }

}
