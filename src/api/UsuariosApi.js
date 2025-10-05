export const obtenerUsuarios = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/Usuarios');
        if (!response.ok) {
            throw new Error('Error al obtener usuarios');
        }
        return await response.json();
    } catch (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('No se pudo conectar con el servidor');
        }
        throw error;
    }
};

export const obtenerUsuarioPorId = async (id) => {
    try {
        const res = await fetch(`http://localhost:8080/api/Usuarios/${id}`, {
            method: 'GET',
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Usuario no encontrado');
        }
        return await res.json();
    } catch (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('No se pudo conectar con el servidor');
        }
        throw error;
    }
};

export const crearUsuario = async (data) => {
    try {
        const res = await fetch('http://localhost:8080/api/Usuarios', {
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
        return await res.json();
    } catch (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('No se pudo conectar con el servidor');
        }
        throw error;
    }
};

export const eliminarUsuario = async (id) => {
    try {
        const res = await fetch(`http://localhost:8080/api/Usuarios/${id}`, {
            method: 'DELETE',
        });
        
        if (res.status === 204) {
            return null;
        }
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Error al eliminar usuario');
        }
        return await res.json();
    } catch (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('No se pudo conectar con el servidor');
        }
        throw error;
    }
};

export const actualizarUsuario = async (id, data) => {
    try {
        const res = await fetch(`http://localhost:8080/api/Usuarios/${id}`, {
            method: 'PUT',
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Error al actualizar usuario');
        }
        return await res.json();
    } catch (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('No se pudo conectar con el servidor');
        }
        throw error;
    }
};