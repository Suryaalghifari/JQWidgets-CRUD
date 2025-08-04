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

    public function products_add() // api untuk tambah produk baru
    {
        $data = $this->input->post();

        
        if (empty($data['name'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Name wajib diisi'
            ]);
            return;
        }

        $id = $this->Product_model->insert($data);
        if ($id) {
            echo json_encode(['success' => true, 'id' => $id]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal insert data']);
        }
    }


    public function products_update($id = null) // api untuk update produk berdasarkan ID
    {
        $data = json_decode(file_get_contents('php://input'), true); 

        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'ID wajib ada']);
            return;
        }

        if (!$data || !is_array($data)) {
            echo json_encode(['success' => false, 'message' => 'Data kosong, tidak ada yang diupdate']);
            return;
        }

        $updated = $this->Product_model->update($id, $data);
        if ($updated) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal update data']);
        }
    }
    
    public function products_delete($id = null)// api untuk hapus produk berdasarkan ID
    {
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'ID wajib ada']);
            return;
        }
        $deleted = $this->Product_model->delete($id);
        if ($deleted) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal hapus data']);
        }
    }

}