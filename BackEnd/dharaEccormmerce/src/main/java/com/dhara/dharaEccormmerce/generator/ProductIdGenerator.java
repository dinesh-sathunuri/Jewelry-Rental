package com.dhara.dharaEccormmerce.generator;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ProductIdGenerator implements IdentifierGenerator {

    private static final String PREFIX = "SMG-";

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) throws HibernateException {
        String query = "SELECT MAX(id) FROM product";
        try (Connection connection = session.getJdbcConnectionAccess().obtainConnection();
             PreparedStatement ps = connection.prepareStatement(query);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                String lastId = rs.getString(1);
                if (lastId != null && lastId.startsWith(PREFIX)) {
                    int lastNum = Integer.parseInt(lastId.substring(PREFIX.length()));
                    return PREFIX + (lastNum + 1);
                }
            }
        } catch (SQLException e) {
            throw new HibernateException("Unable to generate Product ID", e);
        }

        return PREFIX + "1000"; // start if no records
    }
}
