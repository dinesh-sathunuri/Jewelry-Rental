package com.dhara.dharaEccormmerce.generator;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Random;

public class AdminIdGenerator implements IdentifierGenerator {

    private final Random random = new Random();

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) throws HibernateException {
        int id;
        boolean exists;

        Class<?> entityClass = object.getClass();

        try (Connection connection = session.getJdbcConnectionAccess().obtainConnection()) {
            do {
                id = 10000 + random.nextInt(90000); // random 5-digit number
                String query = "SELECT 1 FROM admins WHERE id = ?";
                try (PreparedStatement ps = connection.prepareStatement(query)) {
                    ps.setInt(1, id);
                    try (ResultSet rs = ps.executeQuery()) {
                        exists = rs.next();
                    }
                }
            } while (exists);
        } catch (SQLException e) {
            throw new HibernateException("Unable to generate Admin ID", e);
        }

        return id;
    }
}
