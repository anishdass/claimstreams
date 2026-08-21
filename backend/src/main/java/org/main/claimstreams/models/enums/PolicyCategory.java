package org.main.claimstreams.models.enums;

public enum PolicyCategory {
    MOTOR("Motor & Vehicle Insurance"),
    PROPERTY("Property & Home Insurance"),
    LIFE_AND_PROTECTION("Life & Protection Insurance"),
    HEALTH_AND_TRAVEL("Health & Travel Insurance"),
    SPECIALTY("Specialty Personal Insurance"),
    COMMERCIAL("Commercial & Business Insurance");

    private final String displayName;

    PolicyCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
