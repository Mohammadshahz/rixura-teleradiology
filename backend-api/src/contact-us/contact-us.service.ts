import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { UpdateContactUsDto } from './dto/update-contact-us.dto';
import { ContactUs } from './entities/contact-us.entity';
import { FilterContactUsDto } from './dto/filter-contact-us.dto';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactUs)
    private readonly contactUsRepository: Repository<ContactUs>,
  ) {}

  async create(createContactUsDto: CreateContactUsDto): Promise<ContactUs> {
    const contactUs = this.contactUsRepository.create({
      ...createContactUsDto,
      isRead: false, // New contacts are always unread initially
    });
    return await this.contactUsRepository.save(contactUs);
  }

  async findAll(filterDto?: FilterContactUsDto): Promise<{ data: ContactUs[], total: number }> {
    const where: FindOptionsWhere<ContactUs> = {};
    
    if (filterDto) {
      if (filterDto.isRead !== undefined) {
        where.isRead = filterDto.isRead;
      }
      
      if (filterDto.contactType) {
        where.contactType = filterDto.contactType;
      }
      
      if (filterDto.requestType) {
        where.requestType = filterDto.requestType;
      }
      
      if (filterDto.search) {
        where.fullname = Like(`%${filterDto.search}%`);
        // To search in both fullname and email, we need to use more complex query with 'OR' condition
        // This is a simplified version for the example
      }
    }
    
    const [contacts, total] = await this.contactUsRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' }, // Most recent contacts first
    });
    
    return { data : contacts, total };
  }

  async findOne(id: string): Promise<ContactUs> {
    const contactUs = await this.contactUsRepository.findOne({ where: { id } });
    if (!contactUs) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contactUs;
  }

  async markAsRead(id: string): Promise<ContactUs> {
    const contactUs = await this.findOne(id);
    if (contactUs.isRead) {
      return contactUs; // Already read, no need to update
    }
    
    contactUs.isRead = true;
    return await this.contactUsRepository.save(contactUs);
  }

  async markAsUnread(id: string): Promise<ContactUs> {
    const contactUs = await this.findOne(id);
    if (!contactUs.isRead) {
      return contactUs; // Already unread, no need to update
    }
    
    contactUs.isRead = false;
    return await this.contactUsRepository.save(contactUs);
  }

  async update(id: string, updateContactUsDto: UpdateContactUsDto): Promise<ContactUs> {
    const contactUs = await this.findOne(id);
    
    // Update the entity with the new values
    this.contactUsRepository.merge(contactUs, updateContactUsDto);
    return await this.contactUsRepository.save(contactUs);
  }

  async remove(id: string): Promise<void> {
    const contactUs = await this.findOne(id);
    await this.contactUsRepository.remove(contactUs);
  }

  async countUnread(): Promise<number> {
    return await this.contactUsRepository.count({ where: { isRead: false } });
  }
}
