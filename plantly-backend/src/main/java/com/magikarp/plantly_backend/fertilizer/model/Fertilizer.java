package com.magikarp.plantly_backend.fertilizer.model;

import com.magikarp.plantly_backend.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
@Entity
@Table(name="t_fertilizer")
public class Fertilizer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name="user_id", referencedColumnName = "id")
    private User user;

    private String name;
    private BigDecimal nPercentage;
    private BigDecimal pPercentage;
    private BigDecimal kPercentage;
    private String text;
}
