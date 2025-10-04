export const obtenerUsuarios = async () => {
    try {
        const response = await fetch('http://localhost:8081/api/Usuarios');
        if (!response.ok) {
            throw new Error ('error al obtener usuarios');
        }
        return await response.json();
    } catch (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('no se pudo conectar con el servidor');
        }
        throw error;
    }
};
export const obtenerUsuarioPorId= async (id) => {
    const res = await fetch(`http://localhost:8081/api/Usuarios/${id}`, {
        method: 'GET',
    });
    if (!res.ok) throw new Error('usuario no encontrado');
    return res.json();
};

export const crearUsuario = async (data) => {
    const res = await fetch('http://localhost:8081/api/Usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al crear usuario');
    }

    return res.json();
};

export const eliminarUsuario = async (id) => {
    const res = await fetch(`http://localhost:8081/api/Usuarios/${id}`, {
        method: 'DELETE',
    });
    if (res.status === 204) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al eliminar usuario');
    }

    return null;
    }
export const actualizarUsuario = async (id, data) => {
    const res = await fetch(`http://localhost:8081/api/Usuarios/${id}`, {
        method: 'PUT',
        headers: { "CONTENT-TYPE": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al actualizar usuario');
    }
    return res.json();
};

