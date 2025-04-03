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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size exceeds 5MB");
            return;
        }
    
        try {
            // Prepare data to be sent to the API
            const updateData = {
                mimeType: file.type,
            };
    
            // Call the Next.js API route to get the upload URL
            const response = await fetch("/api/auth/update-avatar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });
    
            const { uploadUrl } = await response.json();
    
            if (!uploadUrl) {
                toast.error("Failed to generate upload URL");
                return;
            }
    
            // Upload the image to Azure Blob Storage
            const uploadResponse = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
                headers: { "x-ms-blob-type": "BlockBlob" },
            });
    
            if (!uploadResponse.ok) {
                throw new Error("Upload failed");
            }
    
            // After uploading, store the image URL
            const imageUrl = uploadUrl.split("?")[0]; // Removing the SAS token
            setFormData((prev) => ({ ...prev, avatar: imageUrl })); // Store image URL
    
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Image upload failed");
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
                avatar: data.avatarUrl || formData.avatar, 
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

                <div>
                    <label className="block mb-1 font-semibold">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2 border rounded dark:bg-dark"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">
                        Current Password <span className="text-sm italic font-base">(Needed if you change your password)</span>
                    </label>
                    <input
                        type="password"
                        value={formData.oldPassword}
                        onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                        className="w-full p-2 border rounded dark:bg-dark"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">
                        New Password <span className="text-sm italic font-base">(Leave blank if you don’t wish to change it)</span>
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full p-2 border rounded dark:bg-dark"
                    />
                    {formData.password && (
                        <ul className="mt-2 text-sm">
                            <li className={hasNoMoreThanTwoIdentical(formData.password) ? "text-green-500" : "text-red-500"}>
                                No more than 2 identical characters in a row
                            </li>
                            <li className={hasSpecialCharacters(formData.password) ? "text-green-500" : "text-red-500"}>
                                Special characters (!@#$%^&*)
                            </li>
                            <li className={hasMixedCaseAndNumbers(formData.password) ? "text-green-500" : "text-red-500"}>
                                Lower case (a-z), upper case (A-Z), and numbers (0-9)
                            </li>
                            <li className={hasMinLength(formData.password) ? "text-green-500" : "text-red-500"}>
                                At least 8 characters
                            </li>
                        </ul>
                    )}
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Confirm New Password</label>
                    <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full p-2 border rounded dark:bg-dark"
                    />
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}
                {success && <div className="text-green-500 text-sm">{success}</div>}
            </div>

            <button type="submit" className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Save Changes
            </button>
        </form>
    );
}
