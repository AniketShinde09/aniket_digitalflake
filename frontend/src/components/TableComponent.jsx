import React from 'react';
import { useTable, useSortBy } from 'react-table';
import styles from './styles/Table.module.css';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useToast } from '@chakra-ui/react';
import { AiOutlineArrowLeft } from "react-icons/ai"; // Back Arrow Icon
import {
    Button,
    Input, Select,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';

const TableComponent = ({ data, onEdit, onDelete }) => {
    const toast = useToast();
    const [isEditing, setIsEditing] = React.useState(false); // Toggle for editing
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false); // Toggle for delete confirmation
    const [currentRowData, setCurrentRowData] = React.useState({});
    const [itemToDelete, setItemToDelete] = React.useState(null); // Item to delete
    const activePage = useSelector((state) => state.activePage); // Get the active page from the Redux state

    // Define columns conditionally based on active page

    const columns = React.useMemo(
        () => {
            const baseColumns = [
                { Header: 'ID', accessor: 'id' },
                {
                    Header: 'Action',
                    accessor: 'action',
                    Cell: ({ row }) => (
                        <div className={styles.but}>
                            <button onClick={() => handleEdit(row.original)}><FaRegEdit /></button>
                            <button onClick={() => handleDeleteConfirm(row.original.id)}><MdOutlineDeleteForever /></button>
                        </div>
                    ),
                },
            ];

            if (activePage === "WareHouse") {
                baseColumns.splice(1, 0, { Header: 'Name', accessor: 'name' });
                baseColumns.splice(2, 0, { Header: 'State', accessor: 'state' });
                baseColumns.splice(3, 0, { Header: 'City', accessor: 'city' });
                baseColumns.splice(4, 0, { Header: 'Status', accessor: 'status' });
            } else if (activePage === "City") {
                baseColumns.splice(1, 0, { Header: 'City Name', accessor: 'name' });
                baseColumns.splice(2, 0, { Header: 'City Code', accessor: 'code' });
                baseColumns.splice(3, 0, { Header: 'State Name', accessor: 'stateName' });
                baseColumns.splice(4, 0, { Header: 'Status', accessor: 'status' });

            } else if (activePage === "State") {
                baseColumns.splice(1, 0, { Header: 'State Name', accessor: 'name' });
                baseColumns.splice(2, 0, { Header: 'State Code', accessor: 'code' });
                baseColumns.splice(3, 0, { Header: 'Status', accessor: 'status' });
            }

            return baseColumns;
        },
        [activePage] // Recompute columns when activePage changes
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data }, useSortBy);

    const handleEdit = (rowData) => {
        setCurrentRowData(rowData);
        setIsEditing(true); // Show edit form
    };

    const handleSave = async () => {
        await onEdit(currentRowData); // Save the edited data
        setIsEditing(false); // Switch back to table view
        toast({
            title: "Item updated.",
            description: "The item has been updated successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    const handleDeleteConfirm = (id) => {
        setItemToDelete(id); // Set item to delete
        setIsDeleteConfirmOpen(true); // Open the delete confirmation modal
    };

    const handleDelete = async () => {
        await onDelete(itemToDelete); // Trigger the delete action
        setIsDeleteConfirmOpen(false); // Close delete confirmation modal
        setItemToDelete(null); // Reset the item to delete
        toast({
            title: "Deleted.",
            description: "The item has been deleted.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    
    if (isEditing) {
        return (
            <div className={styles.editContainer}>
                <div className={styles.editHeader}>
                    <button onClick={() => setIsEditing(false)}><AiOutlineArrowLeft /></button>
                    <h2>Edit Item</h2>
                </div>
                <div className={styles.editForm}>
                    {activePage === "WareHouse" && (
                        <>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Warehouse Name</label>
                                <Input
                                    id="name"
                                    placeholder="Warehouse Name"
                                    value={currentRowData.name || ''}
                                    onChange={(e) => setCurrentRowData({ ...currentRowData, name: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="state">State</label>
                                <Input
                                    id="state"
                                    placeholder="State"
                                    value={currentRowData.state || ''}
                                    onChange={(e) => setCurrentRowData({ ...currentRowData, state: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="city">City</label>
                                <Input
                                    id="city"
                                    placeholder="City"
                                    value={currentRowData.city || ''}
                                    onChange={(e) => setCurrentRowData({ ...currentRowData, city: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="status">Status</label>
                                <Select
                                    id="status"
                                    value={currentRowData.status || ''}
                                    onChange={(e) => setCurrentRowData({ ...currentRowData, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </Select>
                            </div>
                        </>
                    )}

                    {activePage === "City" && (
                        <>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">City Name</label>
                                <Input
                                    id="name"
                                    placeholder="City Name"
                                    value={currentRowData.name || ''}
                                    onChange={(e) => setCurrentRowData({ ...currentRowData, name: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="code">City Code</label>
                                <Input
                                    id="code"
                                    placeholder="City Code"
                                    value={currentRowData.code || ''}
                                    onChange={(e) => setCurrentRowData({ ...currentRowData, code: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="stateName">State Name</label>
                                <Input
                                    id="stateName"
                                    placeholder="State Name"
                                    value={currentRowData.stateName || ''}
                                    onChange={(e) => setCurrentRowData({ ...currentRowData, stateName: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="status">Status</label>
                                <Select
                                    id="status"
                                    value={currentRowData.status || ''}
                                    onChange={(e) => setCurrentRowData({ ...currentRowData, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </Select>
                            </div>
                        </>
                    )}

                    {activePage === "State" && (
                        <>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">State Name</label>
                                <Input
                                    id="name"
                                    placeholder="State Name"
                                    value={currentRowData.name || ''}
                                    onChange={(e) => setCurrentRowData({ ...currentRowData, name: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="code">State Code</label>
                                <Input
                                    id="code"
                                    placeholder="State Code"
                                    value={currentRowData.code || ''}
                                    onChange={(e) => setCurrentRowData({ ...currentRowData, code: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="status">Status</label>
                                <Select
                                    id="status"
                                    value={currentRowData.status || ''}
                                    onChange={(e) => setCurrentRowData({ ...currentRowData, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </Select>
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.editActions}>
                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button colorScheme="blue" onClick={handleSave}>Save</Button>
                </div>
            </div>
        );
    }


    // Render table when not editing
    return (
        <>
            <table {...getTableProps()} className={styles.table}>
                <thead>
                    {headerGroups.map((headerGroup, ind) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={ind}>
                            {headerGroup.headers.map((column, i) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} key={i}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
    {rows.map(row => {
        prepareRow(row);
        return (
            <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map(cell => {
                    if (cell.column.id === 'status') {
                        return (
                            <td {...cell.getCellProps()} key={cell.column.id}>
                                <span 
                                    style={{
                                        color: cell.value === 'Active' ? 'green' : 'red', 
                                        fontWeight: 'bold' 
                                    }}>
                                    {cell.value}
                                </span>
                            </td>
                        );
                    }
                    return (
                        <td {...cell.getCellProps()} key={cell.column.id}>
                            {cell.render('Cell')}
                        </td>
                    );
                })}
            </tr>
        );
    })}
</tbody>

            </table>

            {/* Delete Confirmation Modal */}
            <Modal onClose={() => setIsDeleteConfirmOpen(false)} isOpen={isDeleteConfirmOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Deletion</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <p>Are you sure you want to delete this item?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => setIsDeleteConfirmOpen(false)}>No</Button>
                        <Button colorScheme="blue" onClick={handleDelete}>Yes</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default TableComponent;
