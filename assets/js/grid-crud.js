$(function () {
	alert("Inisialisasi grid akan dijalankan");

	var source = {
		datatype: "json",
		datafields: [
			{ name: "id", type: "string" },
			{ name: "name", type: "string" },
			{ name: "type", type: "string" },
			{ name: "calories", type: "string" },
			{ name: "totalfat", type: "string" },
			{ name: "protein", type: "string" },
		],
		url: base_url + "index.php/grid/get_json",
	};
	var dataAdapter = new $.jqx.dataAdapter(source, {
		loadComplete: function (records) {
			console.log("Loaded records:", records);
		},
		loadError: function (xhr, status, error) {
			console.log("Load error:", error);
		},
	});

	console.log("Mau inisialisasi jqxGrid");
	$("#jqxgrid").jqxGrid({
		width: 900,
		height: 400,
		source: dataAdapter,
		pageable: true,
		sortable: true,
		filterable: true,
		editable: true,
		columnsresize: true,
		selectionmode: "singlecell",
		columns: [
			{ text: "ID", datafield: "id", width: 60 },
			{ text: "Name", datafield: "name", width: 200 },
			{ text: "Type", datafield: "type", width: 180 },
			{ text: "Calories", datafield: "calories", width: 80 },
			{ text: "Total Fat", datafield: "totalfat", width: 80 },
			{ text: "Protein", datafield: "protein", width: 80 },
		],
	});
	console.log("SESUDAH inisialisasi jqxGrid");
});
