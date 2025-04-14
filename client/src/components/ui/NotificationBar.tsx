import React, { UIEvent, useEffect, useRef, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { PiBell, PiBellSimpleRinging } from "react-icons/pi";
import {
  useGetMyNotificationsQuery,
  useSetAsReadMyAllNotificationsMutation,
} from "../../redux/features/notification/notification.api";
import { useRouter } from "next/navigation";
import { INotification } from "@/types/notification.type";
import { useGetMyCountQuery } from "@/redux/features/utils/utils.api";
import { getTimeAgo } from "@/utils/helpers";

const NotificationBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [allNotifications, setAllNotifications] = useState<INotification[]>([]);
  const router = useRouter();
  const barRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const bar = barRef.current;

    if (!bar) return;

    const handler2 = (event: MouseEvent) => {
      const target = event.target;
      if (!bar.contains(target as Node)) {
        setIsOpen(false);
      }
    };

    // bar.addEventListener("scroll", handler);
    document.addEventListener("mousedown", handler2);

    return () => {
      // bar.removeEventListener("scroll", handler);
      document.removeEventListener("mousedown", handler2);
    };
  }, [isOpen, barRef.current?.onscroll]);

  const {
    data: notificationData,
    isLoading: notificationsIsLoading,
    isFetching: notificationsIsRefetching,
    refetch,
  } = useGetMyNotificationsQuery([{ name: "limit", value: 2 }]);

  const notifications = notificationData?.data;
  const meta = notificationData?.meta;

  const [page, setPage] = useState(meta?.page || 1);

  const totalPage = meta ? Math.ceil(meta?.totalResult / meta?.limit) : 1;

  const handleOnScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement; // Cast to HTMLDivElement

    if (
      target.scrollTop + target.clientHeight + 10 >= target.scrollHeight &&
      meta &&
      page < totalPage
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setPage((p) => p + 1);
        refetch();
        setIsLoading(false);
      }, 600);
    }
  };

  const { data } = useGetMyCountQuery(undefined);

  const newNotificationsTotal = data?.data.newNotification;

  useEffect(() => {
    if (
      !notificationsIsLoading &&
      !notificationsIsRefetching &&
      notifications &&
      notifications.length
    ) {
      setAllNotifications((p) => [...p, ...notifications] as any);
    }
  }, [notificationsIsLoading, notificationsIsRefetching]);

  const handelOnClick = (notification: INotification) => {
    if (notification.href) {
      router.push(notification.href);
      setIsOpen(false);
    }
  };

  const [setReadAll] = useSetAsReadMyAllNotificationsMutation();

  useEffect(() => {
    if (isOpen) {
      setReadAll(undefined);
    }
  }, [isOpen]);
  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen((p) => !p);
        }}
        className="text-3xl p-2   text-black rounded-full relative"
      >
        <PiBell />
        {newNotificationsTotal !== 0 && (
          <div className="size-5 flex justify-center items-center bg-red-500 rounded-full absolute  -top-1  right-0 text-[0.6rem] text-white">
            {newNotificationsTotal}
          </div>
        )}
      </button>

      {isOpen && (
        <div
          id="notification-bar"
          ref={barRef}
          onScroll={handleOnScroll}
          className="absolute right-0 w-60 h-60 z-40 overflow-y-auto no-scrollbar p-3 bg-white shadow-2xl  rounded-md "
        >
          <h3 className="text-xl font-semibold font-jost">Notifications</h3>
          <div className=" mt-2">
            {allNotifications.map((notification, index) => (
              <div
                key={index}
                onClick={() => handelOnClick(notification)}
                className="p-2 flex  gap-1 hover:bg-gray-50 hover:cursor-pointer z-50"
              >
                <div className={`${!notification.isRead ? "text-red-600" : "text-green-600"}`}>
                  <span>
                    <GoDotFill />
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 text-[0.8rem]">
                    {getTimeAgo(notification.createdAt)}
                  </p>
                  <h2 className="text-[0.8rem] font-medium  font-secondary">
                    {notification.title}
                  </h2>
                  <p className="text-xs">{notification.message}</p>
                </div>
              </div>
            ))}
          </div>
          {isLoading && <p className="mt-1 text-gray-700 font-medium">Loading..</p>}
        </div>
      )}
    </div>
  );
};

export default NotificationBar;
