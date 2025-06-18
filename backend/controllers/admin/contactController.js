const pool = require('../../models/db'); // sigurohu që kjo rrugë është e saktë

exports.getAllEmails = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_emails ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Gabim gjatë marrjes së emaileve:', err);
    res.status(500).json({ message: 'Gabim gjatë marrjes së emaileve' });
  }
};

exports.createEmail = async (req, res) => {
  const {
    fullName,
    companyName,
    location,
    phone,
    email,
    areaOfContact,
    otherArea,
    message,
    applyToPartner
  } = req.body;

  if (!fullName || !email || !areaOfContact) {
    return res.status(400).json({ message: 'Fusha të detyrueshme mungojnë' });
  }

  try {
    const user_id = req.user?.id || null;

    const [result] = await pool.query(
      `INSERT INTO contact_emails 
       (user_id, fullName, companyName, location, phone, email, areaOfContact, otherArea, message, applyToPartner) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        fullName,
        companyName || null,
        location || null,
        phone || null,
        email,
        areaOfContact,
        otherArea || null,
        message || null,
        applyToPartner || false
      ]
    );

    res.status(201).json({ message: 'Emaili u ruajt me sukses', id: result.insertId });
  } catch (err) {
    console.error('Gabim gjatë krijimit të emailit:', err);
    res.status(500).json({ message: 'Gabim gjatë krijimit të emailit' });
  }
};

exports.updateEmail = async (req, res) => {
  const id = req.params.id;
  const {
    fullName,
    companyName,
    location,
    phone,
    email,
    areaOfContact,
    otherArea,
    message,
    applyToPartner
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE contact_emails 
       SET fullName = ?, companyName = ?, location = ?, phone = ?, email = ?, areaOfContact = ?, otherArea = ?, message = ?, applyToPartner = ?
       WHERE id = ?`,
      [
        fullName,
        companyName || null,
        location || null,
        phone || null,
        email,
        areaOfContact,
        otherArea || null,
        message || null,
        applyToPartner || false,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Emaili nuk u gjet' });
    }

    res.json({ message: 'Emaili u përditësua me sukses' });
  } catch (err) {
    console.error('Gabim gjatë përditësimit:', err);
    res.status(500).json({ message: 'Gabim gjatë përditësimit të emailit' });
  }
};

exports.deleteEmail = async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await pool.query('DELETE FROM contact_emails WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Emaili nuk u gjet' });
    }

    res.json({ message: 'Emaili u fshi me sukses' });
  } catch (err) {
    console.error('Gabim gjatë fshirjes:', err);
    res.status(500).json({ message: 'Gabim gjatë fshirjes së emailit' });
  }
};

// Funksioni për POST /api/contact me verifyToken (për user normal)
exports.sendContactMessage = async (req, res) => {
  console.log('req.user:', req.user);  // <- shto këtë

  try {
    const {
      fullName,
      companyName,
      location,
      phone,
      email,
      areaOfContact,
      otherArea,
      message,
      applyToPartner
    } = req.body;

    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ message: 'Përdoruesi nuk është i identifikuar' });
    }

    if (!fullName || !email || !areaOfContact) {
      return res.status(400).json({ message: 'Fusha të detyrueshme mungojnë' });
    }

    const [result] = await pool.query(
      `INSERT INTO contact_emails 
       (user_id, fullName, companyName, location, phone, email, areaOfContact, otherArea, message, applyToPartner) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        fullName,
        companyName || null,
        location || null,
        phone || null,
        email,
        areaOfContact,
        otherArea || null,
        message || null,
        applyToPartner || false
      ]
    );

    res.status(201).json({ message: 'Mesazhi u dërgua me sukses', id: result.insertId });
  } catch (error) {
    console.error('Gabim gjatë dërgimit të mesazhit:', error);
    res.status(500).json({ message: 'Gabim gjatë dërgimit të mesazhit' });
  }
};
