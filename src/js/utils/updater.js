import loadRSS from './loader.js';
import parseRSS from './parser.js';

class RSSUpdater {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.timeoutId = null;
    this.updateInterval = 5000; // 5 секунд
    this.isUpdating = false;
    this.newPostsCount = 0;
  }

  start() {
    this.scheduleUpdate();
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  scheduleUpdate() {
    this.timeoutId = setTimeout(() => {
      this.updateFeeds();
    }, this.updateInterval);
  }

  async updateFeeds() {
    if (this.isUpdating) {
      this.scheduleUpdate();
      return;
    }

    this.isUpdating = true;
    this.newPostsCount = 0;
    const feeds = this.model.getFeeds();

    if (feeds.length === 0) {
      this.isUpdating = false;
      this.scheduleUpdate();
      return;
    }

    console.log('Checking for updates...');

    try {
      const updatePromises = feeds.map(feed => 
        this.updateFeed(feed).catch(error => {
          console.error(`Error updating feed ${feed.url}:`, error.message);
          return 0;
        })
      );

      const results = await Promise.all(updatePromises);
      this.newPostsCount = results.reduce((sum, count) => sum + count, 0);
      
      if (this.newPostsCount > 0) {
        console.log(`Total new posts: ${this.newPostsCount}`);
        // this.view.showNewPostsNotification(this.newPostsCount); // Раскомментировать для уведомлений
      }
      
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      this.isUpdating = false;
      this.scheduleUpdate();
    }
  }

  async updateFeed(feed) {
    try {
      const xmlString = await loadRSS(feed.url);
      const parsedData = parseRSS(xmlString);
      const newPosts = this.model.addPosts(parsedData.posts, feed.id);
      
      if (newPosts.length > 0) {
        console.log(`Found ${newPosts.length} new posts in ${feed.title}`);
      }
      
      return newPosts.length;
    } catch (error) {
      console.error(`Failed to update feed ${feed.title}:`, error.message);
      throw error;
    }
  }
}

export default RSSUpdater;