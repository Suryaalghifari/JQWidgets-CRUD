<!DOCTYPE html>
<html>
<head>
    <title>Produk</title>
</head>
<body>
    <h1>Daftar Produk (from JSON)</h1>
    <ul>
        <?php foreach($products as $prod): ?>
            <li><?= $prod['name'] ?> (<?= $prod['type'] ?>) - Kalori: <?= $prod['calories'] ?></li>
        <?php endforeach; ?>
    </ul>
</body>
</html>
