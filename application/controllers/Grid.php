<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Grid extends CI_Controller
{
    public function index()
    {
        $this->load->view('home/grid_view');
    }
}
