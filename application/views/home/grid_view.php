<!DOCTYPE html>
<html>
<head>
    <title>Grid jqxGrid</title>
    <link rel="stylesheet" href="<?= base_url('assets/css/styles/jqx.base.css') ?>">
    <link rel="stylesheet" href="<?= base_url('assets/css/styles/jqx.light.css') ?>">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxcore.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxdata.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxbuttons.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxscrollbar.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxmenu.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxlistbox.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxdropdownlist.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxcheckbox.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxgrid.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxgrid.selection.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxgrid.columnsresize.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxgrid.filter.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxgrid.sort.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxgrid.pager.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxgrid.edit.js') ?>"></script>
    <script>
      var base_url = "<?= base_url() ?>";
    </script>
    
    <script src='<?= base_url('assets/js/products/products-directory-map.js') ?>'></script> 
    <script src="<?= base_url('assets/js/products/products-grid.js') ?>"></script>
    
</head>
<body>
    <h2>Data Produk</h2>
    <div id="jqxgrid"></div>
</body>
</html>
