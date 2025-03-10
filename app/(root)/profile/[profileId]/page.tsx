"use client";

import { useQuery } from "convex/react";

import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import ProfileCard from "@/components/ProfileCard";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const params = useParams(); // Получаем параметры
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (params.profileId) {
      setProfileId(params.profileId as string);
    }
  }, [params.profileId]);

  const user = useQuery(api.users.getUserById, {
    clerkId: profileId || "",
  });

  const podcastsData = useQuery(api.podcasts.getPodcastByAuthorId, {
    authorId: profileId || "",
  });

  if (!user || !podcastsData) return <LoaderSpinner />;

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Профиль подкастера
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podcastData={podcastsData!}
          imageUrl={user?.imageUrl!}
          userFirstName={user?.name!}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Все подкасты</h1>
        {podcastsData && podcastsData.podcasts.length > 0 ? (
          <div className="podcast_grid">
            {podcastsData?.podcasts
              ?.slice(0, 4)
              .map((podcast) => (
                <PodcastCard
                  key={podcast._id}
                  imgUrl={podcast.imageUrl!}
                  title={podcast.podcastTitle!}
                  description={podcast.podcastDescription}
                  podcastId={podcast._id}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            title="Вы еще не создали ни одного подкаста"
            buttonLink="/create-podcast"
            buttonText="Создать подкаст"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;