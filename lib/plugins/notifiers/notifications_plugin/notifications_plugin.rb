# -*- coding: utf-8 -*-

class NotificationsPlugin < Plugin
  def created_new_message(thread, parent, message, tags)
    peon(class_name: 'NotifyNewTask', arguments: {type: 'message', thread: thread.thread_id, message: message.message_id})
  end

  def deleted_message(thread, message)
    CfNotification.
      delete_all(["oid = ? AND otype IN ('message:create-answer', 'message:create-activity')",
                  message.message_id])
  end

  def restored_message(thread, message)
    peon(class_name: 'NotifyNewTask', arguments: {type: 'message', thread: thread.thread_id, message: message.message_id})
  end

  def show_message(thread, message, votes)
    application_controller.notifications if check_for_deleting_notification(message)
  end

  def show_thread(thread, message = nil, votes = nil)
    had_one = false

    thread.sorted_messages.each do |m|
      had_one = true if check_for_deleting_notification(m)
    end

    application_controller.notifications if had_one
  end

  private
  def check_for_deleting_notification(message)
    if user = current_user
      n = CfNotification.
        where(recipient_id: user.user_id,
              oid: message.message_id,
              is_read: false).
        where("otype IN ('message:create-answer','message:create-activity')").
        first

      unless n.blank?
        if (n.otype == 'message:create-answer' and
            uconf('delete_read_notifications_on_answer', 'yes') == 'yes') or
            (n.otype == 'message:create-activity' and
             uconf('delete_read_notifications_on_activity', 'yes') == 'yes')
          n.destroy
        else
          n.is_read = true
          n.save!
        end

        return true
      end
    end

    return false
  end
end

ApplicationController.init_hooks << Proc.new do |app_controller|
  notifications_plugin = NotificationsPlugin.new(app_controller)

  app_controller.notification_center.
    register_hook(CfMessagesController::CREATED_NEW_MESSAGE, notifications_plugin)
  app_controller.notification_center.
    register_hook(CfMessagesController::DELETED_MESSAGE, notifications_plugin)
  app_controller.notification_center.
    register_hook(CfMessagesController::RESTORED_MESSAGE, notifications_plugin)
  app_controller.notification_center.
    register_hook(CfMessagesController::SHOW_MESSAGE, notifications_plugin)
  app_controller.notification_center.
    register_hook(CfMessagesController::SHOW_THREAD, notifications_plugin)
end

# eof
