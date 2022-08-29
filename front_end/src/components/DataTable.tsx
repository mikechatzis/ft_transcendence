import React from 'react'
import {DataGrid, GridRowsProp, GridColDef} from '@mui/x-data-grid'

const DataTable: React.FC = () => {
	const rows: GridRowsProp = [{
		id: 1,
		col1: "kpucylo",
		col2: "100%",
		col3: "froggers"
	},
	{
		id: 2,
		col1: "froggybread",
		col2: "50%",
		col3: "pretty good"
	}]

	const columns: GridColDef[] = [{
		field: "col1",
		headerName: "Player",
		width: 150
	},
	{
		field: "col2",
		headerName: "Win/Loss ratio",
		width: 150
	},
	{
		field: "col3",
		headerName: "Rank",
		width: 150
	}]

	return (
		<div style={{"height": 300, "width": '100%'}}>
			<DataGrid rows={rows} columns={columns} />
		</div>
	)
}

export default DataTable