import { Router } from 'express';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const router = Router();
let pool: Pool;

export const initAuth = (dbPool: Pool) => {
  pool = dbPool;
};

router.post('/login', async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    const result = await pool.query(
      'SELECT id, usuario, contrasena, rol FROM usuarios WHERE usuario = $1',
      [usuario]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

    const user = result.rows[0];

    if (user.contrasena !== contrasena) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, rol: user.rol },
      process.env.JWT_SECRET || 'mi_clave_secreta',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        usuario: user.usuario,
        token: token
      },
      message: 'Inicio de sesión exitoso'
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar el login'
    });
  }
});

export default router;