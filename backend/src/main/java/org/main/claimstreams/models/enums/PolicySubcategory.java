package org.main.claimstreams.models.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.main.claimstreams.models.Policy;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public enum PolicySubcategory {
    // Motor Subcategories
    PRIVATE_CAR("Private Car", PolicyCategory.MOTOR),
    COMMERCIAL_VEHICLE("Commercial Vehicle / Van", PolicyCategory.MOTOR),
    MOTORCYCLE("Motorcycle & Scooter", PolicyCategory.MOTOR),
    EV_AND_HYBRID("Electric & Hybrid Vehicle", PolicyCategory.MOTOR),

    // Property Subcategories
    FLAT_OR_APARTMENT("Flat / Apartment", PolicyCategory.PROPERTY),
    HOUSE("Detached / Semi-Detached / Terraced House", PolicyCategory.PROPERTY),
    LANDLORD_RENTAL("Landlord Rental Property", PolicyCategory.PROPERTY),
    UNOCCUPIED_HOME("Unoccupied Property", PolicyCategory.PROPERTY),

    // Life & Protection Subcategories
    MORTGAGE_PROTECTION("Mortgage Protection", PolicyCategory.LIFE_AND_PROTECTION),
    FAMILY_INCOME_BENEFIT("Family Income Benefit", PolicyCategory.LIFE_AND_PROTECTION),
    CRITICAL_ILLNESS_STANDALONE("Standalone Critical Illness", PolicyCategory.LIFE_AND_PROTECTION),

    // Health & Travel Subcategories
    INDIVIDUAL_HEALTH("Individual Private Medical", PolicyCategory.LIFE_AND_PROTECTION),
    FAMILY_HEALTH("Family Private Medical", PolicyCategory.LIFE_AND_PROTECTION),
    EUROPEAN_TRAVEL("European Travel", PolicyCategory.LIFE_AND_PROTECTION),
    WORLDWIDE_TRAVEL("Worldwide Travel", PolicyCategory.LIFE_AND_PROTECTION),

    // Specialty Subcategories
    DOG("Dog Insurance", PolicyCategory.SPECIALTY),
    CAT("Cat Insurance", PolicyCategory.SPECIALTY),
    SMARTPHONE("Smartphone Insurance", PolicyCategory.SPECIALTY),
    LAPTOP_AND_TABLET("Laptop & Tablet Insurance", PolicyCategory.SPECIALTY),

    // Commercial Subcategories
    SOLE_TRADER("Sole Trader / Freelancer Liability", PolicyCategory.COMMERCIAL),
    SME_PACKAGE("SME Business Package", PolicyCategory.COMMERCIAL),
    DIRECTORS_AND_OFFICERS("Directors & Officers (D&O) Liability", PolicyCategory.COMMERCIAL),
    CYBER_RANSOM_AND_DATA("Cyber Ransom & Data Breach", PolicyCategory.COMMERCIAL);

    @Getter
    private final String displayName;

    @Getter
    private final PolicyCategory policyCategory;

    public static List<PolicySubcategory> getByCategory(PolicyCategory category) {
        return Arrays.stream(values())
                .filter(sub -> sub.getPolicyCategory() == category)
                .collect(Collectors.toList());
    }
}
