const sequelize = require('../config/database'); 
const { Sequelize } = require('sequelize');

exports.updateBalance = async (req, res) => {
  const { userId, amount } = req.body;
  
  if (!userId || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      const [user] = await sequelize.query(
        `UPDATE "Users" 
         SET balance = balance + :amount 
         WHERE id = :userId 
         AND balance + :amount >= 0 
         RETURNING *`,
        {
          replacements: { userId, amount },
          transaction: t,
          type: Sequelize.QueryTypes.UPDATE
        }
      );

      if (!user?.length) {
        throw new Error('Insufficient funds or user not found');
      }
      
      return user[0];
    });

    res.json({ 
      success: true,
      balance: result.balance 
    });
  } catch (error) {
    console.error('Balance update error:', error);
    const statusCode = error.message.includes('Insufficient') ? 400 : 500;
    res.status(statusCode).json({ 
      success: false,
      error: error.message 
    });
  }
};