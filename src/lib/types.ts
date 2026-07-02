import { Timestamp, QueryDocumentSnapshot } from "firebase/firestore";

// --- Entidad: Goal ---
export interface Goal {
  id?: string;
  name: string;
  targetAmount: number;
  createdBy: string;
  createdAt: Timestamp;
}

export const goalConverter = {
  toFirestore: (goal: Goal) => {
    return {
      name: goal.name,
      targetAmount: goal.targetAmount,
      createdBy: goal.createdBy,
      createdAt: goal.createdAt,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: any): Goal => {
    const data = snapshot.data({ serverTimestamps: 'estimate', ...options });
    return {
      id: snapshot.id,
      name: data.name,
      targetAmount: data.targetAmount,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
    };
  }
};

// --- Entidad: Contribution ---
export interface Contribution {
  id?: string;
  goalId: string;
  amount: number;
  user: string;
  createdAt: Timestamp;
  reaction?: string;
}

export const contributionConverter = {
  toFirestore: (contribution: Contribution) => {
    return {
      goalId: contribution.goalId,
      amount: contribution.amount,
      user: contribution.user,
      createdAt: contribution.createdAt,
      reaction: contribution.reaction || null,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: any): Contribution => {
    const data = snapshot.data({ serverTimestamps: 'estimate', ...options });
    return {
      id: snapshot.id,
      goalId: data.goalId,
      amount: data.amount,
      user: data.user,
      createdAt: data.createdAt,
      reaction: data.reaction,
    };
  }
};

// --- Entidad: WishlistItem ---
export interface WishlistItem {
  id?: string;
  name: string;
  isCompleted: boolean;
  createdBy: string;
  createdAt: Timestamp;
}

export const wishlistConverter = {
  toFirestore: (item: WishlistItem) => {
    return {
      name: item.name,
      isCompleted: item.isCompleted,
      createdBy: item.createdBy,
      createdAt: item.createdAt,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: any): WishlistItem => {
    const data = snapshot.data({ serverTimestamps: 'estimate', ...options });
    return {
      id: snapshot.id,
      name: data.name,
      isCompleted: data.isCompleted,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
    };
  }
};

// --- Entidad: UserProfile ---
export interface UserProfile {
  id?: string; // username (ej. espinozaje)
  firstName: string;
  lastName: string;
  birthday?: string; // ISO format YYYY-MM-DD
  updatedAt: Timestamp;
}

export const userProfileConverter = {
  toFirestore: (profile: UserProfile) => {
    return {
      firstName: profile.firstName,
      lastName: profile.lastName,
      birthday: profile.birthday || '',
      updatedAt: profile.updatedAt,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: any): UserProfile => {
    const data = snapshot.data({ serverTimestamps: 'estimate', ...options });
    return {
      id: snapshot.id,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      birthday: data.birthday || '',
      updatedAt: data.updatedAt,
    };
  }
};

// --- Entidad: CoupleSettings ---
export interface CoupleSettings {
  id?: string;
  anniversaryDate: string; // ISO format YYYY-MM-DD
  linkedUsers: string[];
  updatedAt: Timestamp;
}

export const coupleSettingsConverter = {
  toFirestore: (settings: CoupleSettings) => {
    return {
      anniversaryDate: settings.anniversaryDate,
      linkedUsers: settings.linkedUsers,
      updatedAt: settings.updatedAt,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: any): CoupleSettings => {
    const data = snapshot.data({ serverTimestamps: 'estimate', ...options });
    return {
      id: snapshot.id,
      anniversaryDate: data.anniversaryDate || '',
      linkedUsers: data.linkedUsers || [],
      updatedAt: data.updatedAt,
    };
  }
};
