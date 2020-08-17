import React, {Fragment, useState, useEffect} from 'react'

const API = process.env.REACT_APP_API;

export const Users = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [editing, setEditing] = useState(false)
    const [id, setId] = useState(false)

    const [users, setUsers] = useState([])
 
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`${API}/user${editing ? '/'+id: ''}`, {
            method: editing ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        })
        await response.json();
        getUsers()

        setEditing(false);
        setId();
        setName('');
        setEmail('');
        setPassword('');
    }

    useEffect(() => {
        getUsers();
    }, [])

    const getUsers = async () => {
        const response = await fetch(`${API}/users`)
        const data = await response.json();
        setUsers(data);
    }

    const deleteUser = async (id) => {
        const userReponse = window.confirm('Are you sure you want to delete?')
        if (userReponse) {
            const response = await fetch(`${API}/user/${id}`, {
                method: 'DELETE'
            });
            await response.json();
            getUsers()
        }
    }

    const editUser = async (id) => {
        const response = await fetch(`${API}/user/${id}`)
        const data = await response.json();
        setEditing(true);
        setId(id)
        setName(data.name)
        setEmail(data.email)
        setPassword(data.password)
    }

    return (
        <Fragment>
            <h1>Users</h1>
            <div className="row">
                <div className="col-md-4">
                    <form onSubmit={handleSubmit} className="card card-body">
                        <div className="form-group">
                            <input 
                                type="text" 
                                onChange={e => setName(e.target.value)} 
                                value={name}
                                className="form-control"
                                placeholder="name"
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                type="email" 
                                onChange={e => setEmail(e.target.value)} 
                                value={email}
                                className="form-control"
                                placeholder="Email"
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                type="password" 
                                onChange={e => setPassword(e.target.value)} 
                                value={password}
                                className="form-control"
                                placeholder="password"
                            />
                        </div>
                        <button className="btn btn-primary btn-block">
                            {editing ? 'Edit' : 'Create'}
                        </button>
                    </form>
                </div>
                <div className="col-md-8">
                    <table className='table table-stripped'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.password}</td>
                                    <td>
                                        <button 
                                            className='btn btn-sm btn-block btn-secondary'
                                            onClick={() => editUser(user._id)}>
                                            Edit
                                        </button>
                                        <button 
                                            className='btn btn-sm btn-block btn-danger'
                                            onClick={() => deleteUser(user._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    )
}