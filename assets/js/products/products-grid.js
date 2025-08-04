$(function () {
	// --- Source & Data Adapter ---
	const source = {
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
	const dataAdapter = new $.jqx.dataAdapter(source);

	// --- Init Grid ---
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
			const container = $("<div style='margin: 5px;'></div>");
			const addButton = $("<button>Tambah Data</button>");
			const deleteButton = $("<button>Hapus Data</button>");
			container.append(addButton, deleteButton);
			toolbar.append(container);

			addButton.on("click", handleAddRow);
			deleteButton.on("click", handleDeleteRows);
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
				cellsrenderer: (row, column, value) =>
					value
						? `<span>Rp ${parseInt(value).toLocaleString("id-ID")}</span>`
						: "",
			},
			{
				text: "Total Price",
				datafield: "total_price",
				width: 120,
				cellsrenderer: (row, column, value) =>
					value
						? `<span>Rp ${parseInt(value).toLocaleString("id-ID")}</span>`
						: "",
			},
			{
				text: "Directory",
				datafield: "id",
				editable: false,
				width: 100,
				cellsrenderer: (row, column, value) =>
					`<button class="btn-directory" data-id="${value}">📂</button>`,
			},
		],
	});

	// Handler Tambah Row
	function handleAddRow() {
		const newrow = {
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
		const datainfo = $("#jqxgrid").jqxGrid("getdatainformation");
		const lastrow = datainfo.rowscount - 1;
		$("#jqxgrid").jqxGrid("begincelledit", lastrow, "name");
	}

	// Handler Hapus Row
	function handleDeleteRows() {
		const selectedIndexes = $("#jqxgrid").jqxGrid("getselectedrowindexes");
		if (!selectedIndexes.length) {
			alert("Pilih data yang mau dihapus (centang di kiri)!");
			return;
		}
		const idsToDelete = selectedIndexes
			.map((idx) => $("#jqxgrid").jqxGrid("getrowdata", idx)?.id)
			.filter((id) => !!id);

		if (!idsToDelete.length) {
			alert("Tidak ada data valid untuk dihapus!");
			return;
		}
		if (confirm("Yakin hapus " + idsToDelete.length + " data ini?")) {
			let successCount = 0,
				failCount = 0;
			idsToDelete.forEach((id, idx) => {
				$.ajax({
					url: base_url + "index.php/api/products_delete/" + id,
					type: "DELETE",
					dataType: "json",
					success: (response) => {
						if (response.success) successCount++;
						else failCount++;
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
					error: () => {
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
	}

	// Directory Button Handler pakai event delegation (lebih reliable)
	$(document).on("click", ".btn-directory", function (e) {
		e.preventDefault();
		e.stopPropagation();
		const id = $(this).data("id");
		showDirectoryPopup(id);
	});

	// Fungsi showDirectoryPopup
	window.showDirectoryPopup = function (id) {
		const dirs = directoryMap[id] || [];
		if (!dirs.length) {
			Swal.fire("Tidak ada directory/aksi untuk produk ini.");
			return;
		}
		let html = '<ul style="text-align:left">';
		dirs.forEach((d) => {
			html += `<li>${d.url}</li>`;
		});
		html += "</ul>";
		Swal.fire({
			title: "Path Directory",
			html,
			showConfirmButton: true,
			confirmButtonText: "Tutup",
		});
	};

	// Page Size Handler
	$("#jqxgrid").on("pagesizechanged", function (event) {
		const args = event.args;
		const newPageSize = args.pagesize;
		const totalRows = $("#jqxgrid").jqxGrid("getdatainformation").rowscount;
		if (newPageSize === "All" || newPageSize === 0 || newPageSize === "0") {
			$("#jqxgrid").jqxGrid({ pagesize: totalRows });
		}
	});

	// Logic Update Otomatis Kolom (Total, Gram)
	$("#jqxgrid").on("cellvaluechanged", function (event) {
		const { datafield, rowindex, value } = event.args;
		const rowdata = $("#jqxgrid").jqxGrid("getrowdata", rowindex);

		if (["totalfat", "protein"].includes(datafield)) {
			if (value && !value.toString().toLowerCase().endsWith("g")) {
				$("#jqxgrid").jqxGrid("setcellvalue", rowindex, datafield, value + "g");
			}
		} else if (["quantity", "unit_price"].includes(datafield)) {
			const qty = parseInt(rowdata.quantity) || 0;
			const unit = parseInt(rowdata.unit_price) || 0;
			$("#jqxgrid").jqxGrid(
				"setcellvalue",
				rowindex,
				"total_price",
				qty * unit
			);
		}
	});

	// Logic Add / Edit
	$("#jqxgrid").on("cellendedit", function (event) {
		const rowindex = event.args.rowindex;
		const rowdata = $("#jqxgrid").jqxGrid("getrowdata", rowindex);
		const kurang = !rowdata["name"];

		if ((!rowdata.id || rowdata.id === "") && kurang) {
			setTimeout(() => {
				$("#jqxgrid").jqxGrid("begincelledit", rowindex, "name");
			}, 10);
			alert("Field berikut wajib diisi: name");
			return;
		}

		// Jika row baru (insert)
		if ((!rowdata.id || rowdata.id === "") && !kurang) {
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
			return;
		}

		// Jika update
		if (rowdata.id) {
			rowdata.quantity = !isNaN(rowdata.quantity)
				? parseInt(rowdata.quantity)
				: 0;
			rowdata.unit_price = !isNaN(rowdata.unit_price)
				? parseInt(rowdata.unit_price)
				: 0;
			rowdata.total_price = rowdata.quantity * rowdata.unit_price;
			$.ajax({
				url: base_url + "index.php/api/products_update/" + rowdata.id,
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
