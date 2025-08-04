$(function () {
	var source = {
		datatype: "json",
		datafields: [
			{ name: "id", type: "string" },
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

	$("#jqxgrid").jqxGrid({
		width: "100%",
		height: 600,
		source: dataAdapter,
		pageable: true,
		pagesizeoptions: ["5", "10", "20", "50", "100"],
		pagesize: 20,
		sortable: true,
		filterable: true,
		editable: true,
		columnsresize: true,
		selectionmode: "checkbox",
		showtoolbar: true,
		rendertoolbar: function (toolbar) {
			var container = $("<div style='margin: 5px;'></div>");
			var addButton = $("<button>Tambah Data</button>");
			var deleteButton = $("<button>Hapus Data</button>");
			toolbar.append(container);
			container.append(addButton);
			container.append(deleteButton);

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
				var datainfo = $("#jqxgrid").jqxGrid("getdatainformation");
				var lastrow = datainfo.rowscount - 1;
				$("#jqxgrid").jqxGrid("begincelledit", lastrow, "name");
			});

			deleteButton.on("click", function () {
				var selectedIndexes = $("#jqxgrid").jqxGrid("getselectedrowindexes");
				if (!selectedIndexes.length) {
					alert("Pilih data yang mau dihapus (centang di kiri)!");
					return;
				}

				// Ambil semua id yang valid
				var idsToDelete = [];
				selectedIndexes.forEach(function (idx) {
					var rowdata = $("#jqxgrid").jqxGrid("getrowdata", idx);
					if (rowdata && rowdata.id) idsToDelete.push(rowdata.id);
				});

				if (!idsToDelete.length) {
					alert("Tidak ada data valid untuk dihapus!");
					return;
				}

				if (confirm("Yakin hapus " + idsToDelete.length + " data ini?")) {
					var successCount = 0,
						failCount = 0;
					idsToDelete.forEach(function (id, idx) {
						$.ajax({
							url: base_url + "index.php/api/products_delete/" + id, // api untuk hapus produk
							type: "DELETE",
							dataType: "json",
							success: function (response) {
								if (response.success) successCount++;
								else failCount++;
								// Refresh setelah request terakhir
								if (idx === idsToDelete.length - 1) {
									$("#jqxgrid").jqxGrid("updatebounddata");
									alert(
										successCount +
											" data berhasil dihapus, " +
											failCount +
											" gagal."
									);
								}
							},
							error: function () {
								failCount++;
								if (idx === idsToDelete.length - 1) {
									$("#jqxgrid").jqxGrid("updatebounddata");
									alert(
										successCount +
											" data berhasil dihapus, " +
											failCount +
											" gagal."
									);
								}
							},
						});
					});
				}
			});
		},

		columns: [
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

	$("#jqxgrid").on("pagesizechanged", function (event) {
		var args = event.args;
		var newPageSize = args.pagesize;
		var dataInfo = $("#jqxgrid").jqxGrid("getdatainformation");
		var totalRows = dataInfo.rowscount;

		// --- console.log di dalam handler ---
		console.log("pagesize:", newPageSize, "totalRows:", totalRows);

		if (newPageSize === "All" || newPageSize === 0 || newPageSize === "0") {
			$("#jqxgrid").jqxGrid({ pagesize: totalRows });
		}
	});

	$("#jqxgrid").on("cellvaluechanged", function (event) {
		var datafield = event.args.datafield;
		var rowindex = event.args.rowindex;
		var value = event.args.value;
		var rowdata = $("#jqxgrid").jqxGrid("getrowdata", rowindex);

		switch (datafield) {
			case "totalfat":
			case "protein":
				if (value && !value.toString().toLowerCase().endsWith("g")) {
					$("#jqxgrid").jqxGrid(
						"setcellvalue",
						rowindex,
						datafield,
						value + "g"
					);
				}
				break;
			case "quantity":
			case "unit_price":
				var qty = parseInt(rowdata.quantity) || 0;
				var unit = parseInt(rowdata.unit_price) || 0;
				$("#jqxgrid").jqxGrid(
					"setcellvalue",
					rowindex,
					"total_price",
					qty * unit
				);
				break;

			default:
				break;
		}
	});

	$("#jqxgrid").on("cellendedit", function (event) {
		var rowindex = event.args.rowindex;
		var rowdata = $("#jqxgrid").jqxGrid("getrowdata", rowindex);

		// Hanya cek name
		var kurang = [];
		if (!rowdata["name"] || rowdata["name"] === "") kurang.push("name");

		// Kalau name kosong, blok tambah
		if ((!rowdata.id || rowdata.id === "") && kurang.length > 0) {
			setTimeout(function () {
				$("#jqxgrid").jqxGrid("begincelledit", rowindex, "name");
			}, 10);
			alert("Field berikut wajib diisi: name");
			return;
		}

		// Kalau name terisi, boleh add
		if ((!rowdata.id || rowdata.id === "") && kurang.length === 0) {
			rowdata.quantity = !isNaN(rowdata.quantity)
				? parseInt(rowdata.quantity)
				: 0;
			rowdata.unit_price = !isNaN(rowdata.unit_price)
				? parseInt(rowdata.unit_price)
				: 0;
			rowdata.total_price = rowdata.quantity * rowdata.unit_price;

			$.ajax({
				url: base_url + "index.php/api/products_add", // api untuk tambah produk
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
			return;
		}

		if (rowdata.id) {
			rowdata.quantity = !isNaN(rowdata.quantity)
				? parseInt(rowdata.quantity)
				: 0;
			rowdata.unit_price = !isNaN(rowdata.unit_price)
				? parseInt(rowdata.unit_price)
				: 0;
			rowdata.total_price = rowdata.quantity * rowdata.unit_price;

			$.ajax({
				url: base_url + "index.php/api/products_update/" + rowdata.id, // API untuk update produk
				type: "PUT",
				data: JSON.stringify(rowdata),
				dataType: "json",
				success: function (response) {
					if (response.success) {
						alert("Data berhasil diupdate!");
					} else {
						alert("Gagal update data: " + response.message);
					}
				},
				error: function (xhr, status, error) {
					alert("Terjadi error update: " + error + "\n" + xhr.responseText);
				},
			});
		}
	});
});
