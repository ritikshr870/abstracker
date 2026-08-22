import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<import('firebase/auth').UserCredential>;
  signInWithEmail: (email: string, pass: string) => Promise<import('firebase/auth').UserCredential>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<import('firebase/auth').UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


async function sendWelcomeEmail(email: string, name: string) {
  try {
    let htmlBody = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.2);">
          <div style="padding: 40px 30px; text-align: center;">
            <div style="background: white; width: 80px; height: 80px; border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 8px 16px rgba(0,0,0,0.1);">
              <img loading="lazy" width="800" height="600" src="https://ik.imagekit.io/xgxpgvop9/abstracker.jpg" alt="AbsTracker" style="height: 50px; border-radius: 12px; object-fit: contain;" />
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Welcome to AbsTracker! 🚀</h1>
          </div>
          <div style="background-color: #ffffff; padding: 40px 30px; border-radius: 16px 16px 0 0; margin-top: -10px;">
            <p style="font-size: 18px; color: #1e293b; margin-top: 0; font-weight: 600;">Hi ${name},</p>
            <p style="font-size: 16px; color: #475569; line-height: 1.6;">We are absolutely thrilled to have you onboard! AbsTracker is India's premier Government Approved AIS-140 GPS & Fleet Management provider.</p>
            
            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 0 12px 12px 0; margin: 25px 0;">
              <p style="font-size: 15px; color: #1e3a8a; margin: 0; font-weight: 500;">Your account has been successfully created. You can now access your dashboard to track your vehicles with 100% precision and compliance.</p>
            </div>

            <div style="text-align: center; margin: 35px 0;">
              <a href="https://abstracker.in/login" style="background: linear-gradient(to right, #ef4444, #dc2626); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);">Access Your Dashboard</a>
            </div>
            <p style="font-size: 14px; color: #64748b; text-align: center; margin-bottom: 0;">Need help? Reply to this email and our expert support team will assist you instantly.</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 24px; text-align: center;">
            <p style="font-size: 13px; color: #94a3b8; margin: 0; font-weight: 500;">&copy; ${new Date().getFullYear()} AbsTracker India. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
    let subject = "Welcome to AbsTracker! 🎉";

    try {
      const { collection, getDocs, query, orderBy, limit } = await import('firebase/firestore');
      const q = query(collection(db, 'email_templates'), orderBy('createdAt', 'desc'), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const t = snap.docs[0].data();
        let customHtml = t.html || t.body || '';
        // Basic replacement for variables
        customHtml = customHtml.replace(/\${name}/g, name).replace(/{{name}}/g, name);
        if (customHtml.trim()) {
          htmlBody = customHtml;
        }
        if (t.subject) {
          subject = t.subject.replace(/\${name}/g, name).replace(/{{name}}/g, name);
        }
      }
    } catch (dbErr) {
      console.warn("Failed to load custom email template, using default.", dbErr);
    }

    await fetch('https://abstracker.abstracker0.workers.dev/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        from: 'AbsTracker <no-reply@abstracker.in>',
        subject: subject,
        htmlBody: htmlBody
      })
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      const result = await signInWithPopup(auth, provider);
      
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: result.user.displayName || 'User',
          email: result.user.email,
          createdAt: new Date().toISOString(),
          authProvider: 'google',
          role: 'user'
        });
        
        // Send Welcome Email
        await sendWelcomeEmail(result.user.email!, result.user.displayName || 'User');
      }
      return result;
    } catch (error: any) {
      console.error("Google Sign-in popup error:", error);
      
      // Fallback for strict browser policies, popup blockers, or iframe environments
      if (
        error.code === 'auth/popup-blocked' || 
        error.code === 'auth/cross-origin-opener-policy-failed' ||
        error.code === 'auth/popup-closed-by-user' ||
        error.message?.includes('Cross-Origin-Opener-Policy')
      ) {
         console.log("Falling back to signInWithRedirect...");
         await signInWithRedirect(auth, provider);
         return; // The page will redirect
      }
      
      throw error;
    }
  }

  function signInWithEmail(email: string, pass: string) {
    return signInWithEmailAndPassword(auth, email, pass);
  }

  async function signUpWithEmail(email: string, pass: string, name: string) {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    
    await setDoc(doc(db, 'users', result.user.uid), {
      name,
      email,
      createdAt: new Date().toISOString(),
      authProvider: 'email',
      role: 'user'
    });
    
    // Send Welcome Email
    await sendWelcomeEmail(email, name);
    
    return result;
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    // Handle redirect result immediately upon load
    getRedirectResult(auth).then(async (result) => {
      if (result && result.user) {
        const userRef = doc(db, 'users', result.user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: result.user.displayName || 'User',
            email: result.user.email,
            createdAt: new Date().toISOString(),
            authProvider: 'google',
            role: 'user'
          });
          // Send Welcome Email for redirect auth
          if (result.user.email) {
            sendWelcomeEmail(result.user.email, result.user.displayName || 'User');
          }
        }
      }
    }).catch((err) => {
      console.error("Redirect Auth Error:", err);
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
