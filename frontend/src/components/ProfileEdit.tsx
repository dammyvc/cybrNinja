import { useState } from "react";
import Image from "next/image";
import { useUserData } from "@/contexts/UserContext";
import { toast } from "react-toastify";

interface UpdateData {
    username: string;
    email: string;
    avatar: string; // Will be a base64 string
    oldPassword?: string;
    newPassword?: string;
}

export default function ProfileEdit() {
    const { dbUser, setDbUser } = useUserData();
    const [formData, setFormData] = useState({
        username: dbUser?.username || "",
        email: dbUser?.email || "",
        oldPassword: "",
        password: "",
        confirmPassword: "",
        avatar: dbUser?.avatar || "",
    });
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    const hasNoMoreThanTwoIdentical = (password: string) => !/(.)\1{2,}/.test(password);
    const hasSpecialCharacters = (password: string) => /[!@#$%^&*]/.test(password);
    const hasMixedCaseAndNumbers = (password: string) => /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password);
    const hasMinLength = (password: string) => password.length >= 8;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError("Image size exceeds 5MB");
                toast.error("Image size exceeds 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData((prev) => ({ ...prev, avatar: base64String }));
                setSuccess("Image selected successfully");
                setError("");
                toast.success("Image selected successfully!");
            };
            reader.onerror = () => {
                setError("Failed to read image");
                toast.error("Failed to read image");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!dbUser) {
            setError("No user data available");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        const updateData: UpdateData = {
            username: formData.username,
            email: formData.email,
            avatar: formData.avatar,
        };

        if (formData.password) {
            if (!hasNoMoreThanTwoIdentical(formData.password)) {
                setError("Password cannot have more than 2 identical characters in a row");
                return;
            }
            if (!hasSpecialCharacters(formData.password)) {
                setError("Password must contain special characters");
                return;
            }
            if (!hasMixedCaseAndNumbers(formData.password)) {
                setError("Password must contain lower case, upper case, and numbers");
                return;
            }
            if (!hasMinLength(formData.password)) {
                setError("Password must be at least 8 characters long");
                return;
            }

            updateData.oldPassword = formData.oldPassword;
            updateData.newPassword = formData.password;
        }

        try {
            const res = await fetch("/api/auth/update-profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
                credentials: "include",
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to update profile");
            }

            setDbUser({
                ...dbUser,
                username: formData.username,
                email: formData.email,
                avatar: data.avatarUrl || formData.avatar, // Use returned URL if provided
            });
            setSuccess("Profile updated successfully");
            setError("");
            setFormData((prev) => ({
                ...prev,
                oldPassword: "",
                password: "",
                confirmPassword: "",
            }));
            toast.success("Profile updated successfully!");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
            setError(`Error updating profile: ${errorMessage}`);
            setSuccess("");
            toast.error(errorMessage);
        }
    };

    if (!dbUser) return <div>No user data available</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4">
                <Image
                    src={formData.avatar || "/assets/images/avatar.png"}
                    alt="Profile preview"
                    width={24}
                    height={24}
                    className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                    />
                </div>
            </div>
            {/* Rest of the form remains unchanged */}
            <div className="space-y-4">
                <div>
                    <label className="block mb-1 font-semibold">Username</label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full p-2 border rounded dark:bg-dark"
                        required
                    />
                </div>
                {/* ... other fields ... */}
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {success && <div className="text-green-500 text-sm">{success}</div>}
            </div>
            <button type="submit" className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Save Changes
            </button>
        </form>
    );
}