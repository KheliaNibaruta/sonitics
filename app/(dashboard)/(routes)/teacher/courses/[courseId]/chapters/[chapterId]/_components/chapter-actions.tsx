"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
};

const ChapterActions = ({
    disabled,
    courseId,
    chapterId,
    isPublished
}: ChapterActionsProps) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
                toast.success("Publication de chapitre supprimé avec succès");
            } else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                toast.success("Chapitre publié avec succès");
            }

            router.refresh();

        } catch {
            toast.error("Quelque chose s'est mal passé");
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async() => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);

            toast.success("Chapitre supprimé avec succès");
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);
        } catch {
            toast.error("Quelque chose s'est mal passé");
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className="flex items-center gap-x-2">
        <Button
            onClick={onClick}
            disabled={disabled || isLoading}
            variant="outline"
            size="sm"
        >
            {isPublished ? "Supprimer la publication" : "Publier"}
        </Button>
        <ConfirmModal onConfirm={onDelete}>
            <Button size="sm" disabled={isLoading}>
                <Trash className="h-4 w-4" />
            </Button>
        </ConfirmModal>
    </div>
  )
}

export default ChapterActions