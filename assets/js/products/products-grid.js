$(function () {
	// ---[1. Sumber data dan field grid]---
	var source = {
		datatype: "json",
		datafields: [
			{ name: "id", type: "string" }, // tetap didefinisikan, hanya tidak ditampilkan di grid
			{ name: "name", type: "string" },
			{ name: "type", type: "string" },
			{ name: "calories", type: "string" },
			{ name: "totalfat", type: "string" },
			{ name: "protein", type: "string" },
			{ name: "quantity", type: "string" },
			{ name: "unit_price", type: "string" },
			{ name: "total_price", type: "string" },
		],
		url: base_url + "index.php/api/products_get",
	};

	var dataAdapter = new $.jqx.dataAdapter(source);

	// ---[2. Inisialisasi Grid]---
	$("#jqxgrid").jqxGrid({
		width: "100%",
		height: 600,
		source: dataAdapter,
		pageable: true,
		sortable: true,
		filterable: true,
		editable: true,
		columnsresize: true,
		selectionmode: "singlecell",
		showtoolbar: true,
		rendertoolbar: function (toolbar) {
			// ---[2a. Toolbar tombol tambah data]---
			var container = $("<div style='margin: 5px;'></div>");
			var addButton = $("<button>Tambah Data</button>");
			toolbar.append(container);
			container.append(addButton);
			addButton.on("click", function () {
				var newrow = {
					name: "",
					type: "",
					calories: "",
					totalfat: "",
					protein: "",
					quantity: "",
					unit_price: "",
					total_price: "",
				};
				$("#jqxgrid").jqxGrid("addrow", null, newrow);
				// ---[2b. Fokus otomatis ke cell pertama baris baru]---
				var datainfo = $("#jqxgrid").jqxGrid("getdatainformation");
				var lastrow = datainfo.rowscount - 1;
				$("#jqxgrid").jqxGrid("begincelledit", lastrow, "name");
			});
		},
		columns: [
			// ---[3. ID tidak tampil, hanya field lain yang tampil di grid]---
			{ text: "Name", datafield: "name", width: 200 },
			{ text: "Type", datafield: "type", width: 180 },
			{ text: "Calories", datafield: "calories", width: 80 },
			{ text: "Total Fat", datafield: "totalfat", width: 80 },
			{ text: "Protein", datafield: "protein", width: 80 },
			{ text: "Qty", datafield: "quantity", width: 80 },
			{
				text: "Unit Price",
				datafield: "unit_price",
				width: 100,
				cellsrenderer: function (row, column, value) {
					if (!value) return "";
					return (
						"<span>Rp " + parseInt(value).toLocaleString("id-ID") + "</span>"
					);
				},
			},
			{
				text: "Total Price",
				datafield: "total_price",
				width: 120,
				cellsrenderer: function (row, column, value) {
					if (!value) return "";
					return (
						"<span>Rp " + parseInt(value).toLocaleString("id-ID") + "</span>"
					);
				},
			},
		],
	});

	// ---[4. Otomatis "g" dan kalkulasi total_price setiap value berubah]---
	$("#jqxgrid").on("cellvaluechanged", function (event) {
		var datafield = event.args.datafield;
		var rowindex = event.args.rowindex;
		var value = event.args.value;

		if (
			datafield === "totalfat" &&
			value &&
			!value.toString().toLowerCase().endsWith("g")
		) {
			$("#jqxgrid").jqxGrid("setcellvalue", rowindex, "totalfat", value + "g");
		}
		if (
			datafield === "protein" &&
			value &&
			!value.toString().toLowerCase().endsWith("g")
		) {
			$("#jqxgrid").jqxGrid("setcellvalue", rowindex, "protein", value + "g");
		}

		if (datafield === "quantity" || datafield === "unit_price") {
			var rowdata = $("#jqxgrid").jqxGrid("getrowdata", rowindex);
			var qty = parseInt(rowdata.quantity) || 0;
			var unit = parseInt(rowdata.unit_price) || 0;
			$("#jqxgrid").jqxGrid(
				"setcellvalue",
				rowindex,
				"total_price",
				qty * unit
			);
		}
	});

	$("#jqxgrid").on("cellendedit", function (event) {
		var rowindex = event.args.rowindex;
		var datafield = event.args.datafield;
		var rowdata = $("#jqxgrid").jqxGrid("getrowdata", rowindex);

		// Urutan fields editable
		var fields = [
			"name",
			"type",
			"calories",
			"totalfat",
			"protein",
			"quantity",
			"unit_price",
		];
		var wajib = fields;
		var kurang = [];
		wajib.forEach(function (field) {
			if (!rowdata[field] || rowdata[field] === "") kurang.push(field);
		});

		// ---[Auto-move ke cell berikutnya HANYA jika field belum kosong]---
		if ((!rowdata.id || rowdata.id === "") && kurang.length > 0) {
			// **Langsung pindahkan fokus ke cell wajib pertama yang masih kosong**
			var nextField = kurang[0];
			setTimeout(function () {
				$("#jqxgrid").jqxGrid("begincelledit", rowindex, nextField);
			}, 10);
			// Hanya tampilkan alert sekali (saat cell kosong), tidak terus-terusan
			if (datafield === nextField) {
				alert("Field berikut wajib diisi: " + nextField);
			}
			return;
		}

		// ---[Kalau semua field sudah diisi, baru insert]---
		if ((!rowdata.id || rowdata.id === "") && kurang.length === 0) {
			rowdata.quantity = !isNaN(rowdata.quantity)
				? parseInt(rowdata.quantity)
				: 0;
			rowdata.unit_price = !isNaN(rowdata.unit_price)
				? parseInt(rowdata.unit_price)
				: 0;
			rowdata.total_price = rowdata.quantity * rowdata.unit_price;

			$.ajax({
				url: base_url + "index.php/api/products_add",
				type: "POST",
				data: rowdata,
				dataType: "json",
				success: function (response) {
					if (response.success) {
						alert("Data berhasil ditambah!");
						$("#jqxgrid").jqxGrid("updatebounddata");
					} else {
						alert("Gagal tambah data: " + response.message);
					}
				},
				error: function (xhr, status, error) {
					alert("Terjadi error: " + error + "\n" + xhr.responseText);
				},
			});
		}
	});
});
