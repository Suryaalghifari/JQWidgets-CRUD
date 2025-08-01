<!DOCTYPE html>
<html>
<head>
    <title>Grid jqxGrid </title>
    <!-- Load CSS dari assets/css/styles/ -->
    <link rel="stylesheet" href="<?= base_url('assets/css/styles/jqx.base.css') ?>" type="text/css" />
    <link rel="stylesheet" href="<?= base_url('assets/css/styles/jqx.light.css') ?>" type="text/css" />
    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxcore.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxdata.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxbuttons.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxscrollbar.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxmenu.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxlistbox.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxdropdownlist.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxgrid.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxgrid.selection.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxgrid.columnsresize.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxgrid.filter.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxgrid.sort.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxgrid.pager.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxgrid.grouping.js') ?>"></script>
    <script src="<?= base_url('assets/js/jqwidgets/jqxgrid.edit.js') ?>"></script>

    <script>
      var base_url = "<?= base_url() ?>";
    </script>
    <!-- HAPUS baris console.log di sini! -->
    <script src="<?= base_url('assets/js/grid-crud.js') ?>"></script>
</head>
<body>
    <div id="jqxgrid"></div>
</body>
</html>
