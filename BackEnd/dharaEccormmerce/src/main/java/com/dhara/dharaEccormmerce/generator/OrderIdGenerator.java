package com.dhara.dharaEccormmerce.generator;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.io.Serializable;
import java.security.SecureRandom;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class OrderIdGenerator implements IdentifierGenerator {

    private static final int NUM_LENGTH = 9;
    private static final String PREFIX = "ORD";
    private static final SecureRandom random = new SecureRandom();

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) throws HibernateException {
        String generatedId;
        boolean isUnique = false;

        try (Connection connection = session.getJdbcConnectionAccess().obtainConnection()) {
            while (!isUnique) {
                int min = (int) Math.pow(10, NUM_LENGTH - 1);
                int max = (int) Math.pow(10, NUM_LENGTH) - 1;
                int randomNumber = random.nextInt(max - min + 1) + min;
                generatedId = PREFIX + randomNumber;

                String sql = "SELECT COUNT(*) FROM orders WHERE id = ?";
                try (PreparedStatement ps = connection.prepareStatement(sql)) {
                    ps.setString(1, generatedId);
                    try (ResultSet rs = ps.executeQuery()) {
                        if (rs.next() && rs.getInt(1) == 0) {
                            isUnique = true;
                            return generatedId;
                        }
                    }
                }
            }
        } catch (SQLException e) {
            throw new HibernateException("Unable to generate Order ID", e);
        }

        throw new HibernateException("Failed to generate a unique Order ID");
    }
}
