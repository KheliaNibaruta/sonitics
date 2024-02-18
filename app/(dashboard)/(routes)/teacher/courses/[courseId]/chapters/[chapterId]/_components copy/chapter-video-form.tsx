/* eslint-disable react/jsx-no-undef */
"use client";

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course, MuxData } from "@prisma/client";
import FileUpload from "@/components/file-upload";

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string;
};

const formSchema = z.object({
    videoUrl: z.string().min(1),
});

const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId,
  
}: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapitre modifé avec succès");
            toggleEdit();    
            router.refresh();

        } catch (error) {
            toast.error("Quelque chose s'est mal passé");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Vidéo du cours
                <Button 
                    onClick={toggleEdit}
                    variant="ghost"
                >
                    {isEditing && (
                        <>Annuler</>
                    )}

                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle  className="h-4 w-4 mr-2"/>
                             Ajouter une vidéo
                        </>
                    )}
                    {!isEditing && initialData.videoUrl  && (
                        <>
                            <Pencil className="h-4 w-4 mr-2"/>
                            Editer
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        Vidéo uploadée !
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
                    <div className="text-xs text-muted-foreground mt-2">
                        Uploader la vidéo de ce chapitre
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs">
                    La vidéo peut prendre quelques minutes avant d&napos;apparaitre. Actualiser la page si la vidéo n&apos;apparait pas.
                </div>
            )}
        </div>
      )
    }

export default ChapterVideoForm