import React, { useState, useEffect } from "react";
import { request } from "../axios_helper";
import { Table, Button, Spinner, Container} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await request("GET", "/users/admin/all");
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (userId, action) => {
        try {
            await request("POST", `/users/admin/${userId}/${action}`);
            alert(`User ${action}d successfully!`);
            fetchUsers();
        } catch (error) {
            console.error(`Failed to ${action} user`, error);
            alert(`Failed to ${action} user.`);
        }
    };

    return (
        <Container className="mt-5">
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <Table bordered hover responsive className="shadow-sm">
                    <thead className="table-light">
                    <tr>
                        <th>Email</th>
                        <th>Username</th>
                        <th className="text-center"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.email}</td>
                            <td>{user.fullName}</td>
                            <td className="text-center">
                                <Button
                                    variant={user.accountNonLocked ? "warning" : "success"}
                                    className="me-2"
                                    onClick={() =>
                                        handleAction(user.id, user.accountNonLocked ? "lock" : "unlock")
                                    }
                                >
                                    {user.accountNonLocked ? "Lock" : "Unlock"}
                                </Button>
                                <Button
                                    variant={user.enabled ? "danger" : "info"}
                                    onClick={() =>
                                        handleAction(user.id, user.enabled ? "disable" : "enable")
                                    }
                                >
                                    {user.enabled ? "Disable" : "Enable"}
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default UserManagement;
