//
//  BookSearchDataGoogle.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/09/30.
//

import Foundation
import UIKit


class BookSearchDataGoogle: BookSearchData {

    struct SearchResultJson: Codable {
        struct Item: Codable {
            let volumeInfo: VolumeInfo

        }
        let items: [Item]?
    }
    struct VolumeInfo: Codable {
        let title: String?
        let authors: [String?]
        let infoLink: URL?

        let imageLinks: ImageLinks


    }
    struct ImageLinks: Codable {
        let thumbnail: URL?
    }

    override func searchBook(keyword: String){

            guard let keyword_encode = keyword.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) else {
                return
            }

        guard let req_url = URL(string: "https://www.googleapis.com/books/v1/volumes?q=\(keyword_encode)&maxResults=15&startIndex=0") else {
            return
        }
        let req = URLRequest(url: req_url)
        let session = URLSession.shared

        let task = session.dataTask(with: req, completionHandler: {
            (data, response, error) in
            session.finishTasksAndInvalidate()
            do {
                let decoder = JSONDecoder()
                let json = try decoder.decode(SearchResultJson.self, from: data!)

                if let rsp_items = json.items {
                    self.bookSearchList.removeAll()
                    for rsp_item in rsp_items {
                        if let title = rsp_item.volumeInfo.title,
                           let author = rsp_item.volumeInfo.authors[0],
                           let itemUrl = rsp_item.volumeInfo.infoLink,
                           let imageUrl = rsp_item.volumeInfo.imageLinks.thumbnail,
                           let imageData = try? Data(contentsOf: imageUrl),
                           let image = UIImage(data: imageData)?.withRenderingMode(.alwaysOriginal){
                            let rsp_book = BookSearchItem(title: title, author: author, itemUrl: itemUrl, imageUrl: imageUrl, image: image)
                            self.bookSearchList.append(rsp_book)
                        }
                    }
                    print(self.bookSearchList)
                }
            } catch {
                print("jsonパースエラー！！")
            }
        })


        task.resume()
        }




}
